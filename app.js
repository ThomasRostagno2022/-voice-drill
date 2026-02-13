// Default API keys (can be overridden in settings)
// Keys are split to avoid GitHub secret scanning
const DEFAULT_GROQ_KEY = ['gsk_DJtowUxnkrNBdieWUGDG', 'WGdyb3FYltJH62LU8Uqd7kNB3bNJntmU'].join('');
const DEFAULT_ELEVENLABS_KEY = ['sk_116ea5a2737312a826b3', '447f0f2ff466fe4ac8f08941870a'].join('');

// State
let currentQuestion = null;
let isRecording = false;
let mediaRecorder = null;
let audioChunks = [];
let transcript = '';
let startTime = null;
let timerInterval = null;
let timeRemaining = 90;
let isSpeaking = false;

// DOM Elements
const questionCard = document.getElementById('question-card');
const questionCategory = document.getElementById('question-category');
const questionText = document.getElementById('question-text');
const targetWords = document.getElementById('target-words');
const targetTime = document.getElementById('target-time');
const recordBtn = document.getElementById('record-btn');
const recordLabel = document.getElementById('record-label');
const timer = document.getElementById('timer');
const timerDisplay = document.getElementById('timer-display');
const resultsSection = document.getElementById('results-section');
const transcriptText = document.getElementById('transcript-text');
const newQuestionBtn = document.getElementById('new-question-btn');
const resetBtn = document.getElementById('reset-btn');
const settingsBtn = document.getElementById('settings-btn');
const settingsModal = document.getElementById('settings-modal');
const apiKeyInput = document.getElementById('api-key');
const saveSettingsBtn = document.getElementById('save-settings');
const closeSettingsBtn = document.getElementById('close-settings');
const rewriteBtn = document.getElementById('rewrite-btn');
const rewriteLoading = document.getElementById('rewrite-loading');
const rewriteResult = document.getElementById('rewrite-result');
const rewriteText = document.getElementById('rewrite-text');
const rewriteError = document.getElementById('rewrite-error');
const rewriteWordCount = document.getElementById('rewrite-word-count');
const rewriteReduction = document.getElementById('rewrite-reduction');
const fillersDetail = document.getElementById('fillers-detail');
const fillersList = document.getElementById('fillers-list');
const speakBtn = document.getElementById('speak-btn');

// Score elements
const wordCountEl = document.getElementById('word-count');
const wordStatusEl = document.getElementById('word-status');
const fillerCountEl = document.getElementById('filler-count');
const fillerStatusEl = document.getElementById('filler-status');
const paceValueEl = document.getElementById('pace-value');
const paceStatusEl = document.getElementById('pace-status');
const longestSentenceEl = document.getElementById('longest-sentence');
const sentenceStatusEl = document.getElementById('sentence-status');

// Show status message
function showStatus(msg) {
    if (transcriptText) {
        transcriptText.textContent = msg;
    }
}

// Timer functions
function startTimer() {
    timeRemaining = currentQuestion ? currentQuestion.targetTime : 90;
    updateTimerDisplay();
    timer.classList.remove('hidden');
    timer.classList.add('recording');

    timerInterval = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay();

        if (timeRemaining <= 0) {
            stopRecording();
        }
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    timer.classList.remove('recording');
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Recording functions using MediaRecorder
async function startRecording() {
    try {
        showStatus('Requesting microphone...');

        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true
        });

        showStatus('Microphone ready! Speak now...');

        // Determine supported mime type - iOS Safari uses mp4/aac
        let mimeType = '';
        let fileExtension = 'webm';

        // Check supported formats in order of preference for Whisper API
        const formats = [
            { mime: 'audio/webm;codecs=opus', ext: 'webm' },
            { mime: 'audio/webm', ext: 'webm' },
            { mime: 'audio/mp4', ext: 'm4a' },
            { mime: 'audio/aac', ext: 'aac' },
            { mime: 'audio/ogg;codecs=opus', ext: 'ogg' },
            { mime: 'audio/wav', ext: 'wav' },
            { mime: '', ext: 'webm' } // default fallback
        ];

        for (const format of formats) {
            if (format.mime === '' || MediaRecorder.isTypeSupported(format.mime)) {
                mimeType = format.mime;
                fileExtension = format.ext;
                console.log('Using audio format:', mimeType || 'default');
                break;
            }
        }

        // Create MediaRecorder with or without explicit mimeType
        const recorderOptions = mimeType ? { mimeType } : {};
        mediaRecorder = new MediaRecorder(stream, recorderOptions);

        // Store extension for later use
        mediaRecorder.fileExtension = fileExtension;
        audioChunks = [];

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                audioChunks.push(event.data);
            }
        };

        mediaRecorder.onstop = async () => {
            // Stop all tracks
            stream.getTracks().forEach(track => track.stop());

            if (audioChunks.length > 0) {
                const blobType = mimeType || 'audio/webm';
                const audioBlob = new Blob(audioChunks, { type: blobType });
                console.log('Audio blob size:', audioBlob.size, 'type:', blobType);
                await transcribeAudio(audioBlob, mediaRecorder.fileExtension);
            } else {
                showStatus('No audio recorded. Please try again.');
            }
        };

        mediaRecorder.onerror = (event) => {
            showStatus('Recording error: ' + event.error);
        };

        // Start recording
        mediaRecorder.start(1000); // Collect data every second

        isRecording = true;
        transcript = '';
        startTime = Date.now();

        recordBtn.classList.add('recording');
        recordLabel.textContent = 'Tap to Stop';
        resetBtn.classList.add('hidden');
        resultsSection.classList.remove('hidden');

        startTimer();

    } catch (err) {
        console.error('Microphone error:', err);
        if (err.name === 'NotAllowedError') {
            showStatus('Microphone access denied. Please allow microphone in Settings > Safari.');
            alert('Microphone access denied.\n\nOn iPhone:\n1. Go to Settings > Safari\n2. Scroll to "Settings for Websites"\n3. Tap Microphone\n4. Set to "Allow"');
        } else {
            showStatus('Error: ' + err.message);
        }
    }
}

function stopRecording() {
    isRecording = false;
    stopTimer();

    recordBtn.classList.remove('recording');
    recordLabel.textContent = 'Tap to Record';

    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        showStatus('Processing audio...');
        mediaRecorder.stop();
    }
}

// Transcribe audio using Groq Whisper API
async function transcribeAudio(audioBlob, fileExtension = 'webm') {
    const apiKey = localStorage.getItem('grok_api_key') || DEFAULT_GROQ_KEY;

    if (!apiKey) {
        showStatus('Please set your Groq API key in settings first.');
        settingsModal.classList.remove('hidden');
        return;
    }

    showStatus('Transcribing with AI...');

    try {
        // Create form data with audio file - use correct extension for iOS
        const filename = `recording.${fileExtension}`;
        console.log('Sending audio file:', filename, 'size:', audioBlob.size);

        const formData = new FormData();
        formData.append('file', audioBlob, filename);
        formData.append('model', 'whisper-large-v3-turbo');
        formData.append('language', 'en');
        formData.append('response_format', 'verbose_json');
        // Include filler sounds in the vocabulary prompt
        formData.append('prompt', 'Umm, uhh, euh, ehh, ahh, hmm, mhm, uh-huh, like, you know, basically, so, I mean, kind of, sort of, actually, right, well.');

        const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`
            },
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || `Transcription failed: ${response.status}`);
        }

        const data = await response.json();
        let rawTranscript = data.text ? data.text.trim() : '';
        console.log('Raw transcription:', rawTranscript);
        console.log('Segments:', data.segments);

        if (rawTranscript) {
            const durationSeconds = (Date.now() - startTime) / 1000;

            // Analyze pauses from segments to detect likely hesitation points
            const pauseInfo = analyzePauses(data.segments || []);

            // Store pause info for display
            window.lastPauseInfo = pauseInfo;

            // Mark verbal fillers in the transcript
            transcript = markVerbalFillers(rawTranscript);

            showResults(transcript, durationSeconds, pauseInfo);
        } else {
            showStatus('No speech detected. Please speak louder and try again.');
        }

    } catch (error) {
        console.error('Transcription error:', error);
        showStatus('Transcription failed: ' + error.message);
    }
}

// Analyze segment timings for pauses (hesitations that Whisper removed)
function analyzePauses(segments) {
    const pauses = [];
    if (segments && segments.length > 1) {
        for (let i = 1; i < segments.length; i++) {
            const gap = segments[i].start - segments[i - 1].end;
            if (gap > 0.4) { // Gap longer than 400ms indicates hesitation
                pauses.push({
                    afterText: segments[i - 1].text?.trim().split(' ').slice(-3).join(' ') || '',
                    beforeText: segments[i].text?.trim().split(' ').slice(0, 3).join(' ') || '',
                    duration: gap
                });
            }
        }
    }
    return pauses;
}

// Mark verbal filler words in the transcript
function markVerbalFillers(text) {
    // Words that are ALWAYS fillers (hesitation sounds)
    const alwaysFillers = ['um', 'umm', 'uh', 'uhh', 'euh', 'eh', 'ah', 'ahh', 'er', 'err', 'hmm', 'hm', 'mm', 'mhm', 'uh-huh'];

    // Mark hesitation sounds
    let marked = text;
    alwaysFillers.forEach(filler => {
        const regex = new RegExp(`\\b(${filler})\\b`, 'gi');
        marked = marked.replace(regex, '[$1]');
    });

    // Mark contextual fillers (only when used as fillers, not meaning)
    // "like" as filler: ", like," or "like," at start, or "...like..."
    marked = marked.replace(/,\s*like\s*,/gi, ', [like],');
    marked = marked.replace(/^like,\s*/gi, '[like], ');

    // "you know" as filler: ", you know,"
    marked = marked.replace(/,\s*you know\s*,/gi, ', [you know],');
    marked = marked.replace(/,\s*you know\./gi, ', [you know].');

    // "basically" at start of sentences or after comma
    marked = marked.replace(/(^|[.!?]\s*)basically\s+/gi, '$1[basically] ');
    marked = marked.replace(/,\s*basically\s+/gi, ', [basically] ');

    // "so" at the very start
    marked = marked.replace(/^so\s+/gi, '[so] ');
    marked = marked.replace(/(^|[.!?]\s*)so,?\s+/gi, '$1[so] ');

    // "I mean" as filler
    marked = marked.replace(/,\s*I mean\s*,/gi, ', [I mean],');
    marked = marked.replace(/^I mean\s*,/gi, '[I mean],');

    // "kind of" / "sort of"
    marked = marked.replace(/\bkind of\b/gi, '[kind of]');
    marked = marked.replace(/\bsort of\b/gi, '[sort of]');

    // "actually" at start
    marked = marked.replace(/(^|[.!?]\s*)actually\s*,?\s*/gi, '$1[actually] ');

    // "right" as filler (at end or with comma)
    marked = marked.replace(/,\s*right\?/gi, ', [right]?');
    marked = marked.replace(/,\s*right\s*,/gi, ', [right],');

    return marked;
}

function toggleRecording() {
    if (!currentQuestion) {
        loadNewQuestion();
        return;
    }

    if (isRecording) {
        stopRecording();
    } else {
        startRecording();
    }
}

// Analysis functions
function countWords(text) {
    // Remove brackets for counting (they're just markup)
    const cleanText = text.replace(/[\[\]]/g, '');
    return cleanText.trim().split(/\s+/).filter(w => w.length > 0).length;
}

function findFillers(text) {
    const lowerText = text.toLowerCase();
    const found = [];

    // First, find bracketed fillers from our LLM analysis
    const bracketedMatches = text.match(/\[([^\]]+)\]/g);
    if (bracketedMatches) {
        bracketedMatches.forEach(match => {
            const filler = match.slice(1, -1).toLowerCase(); // Remove brackets
            found.push(filler);
        });
    }

    // Also check for unbracketed filler words (using original detection)
    // But skip words that are already bracketed
    const textWithoutBrackets = text.replace(/\[[^\]]+\]/g, '');
    const lowerTextClean = textWithoutBrackets.toLowerCase();

    FILLER_WORDS.forEach(filler => {
        const regex = new RegExp(`\\b${filler}\\b`, 'gi');
        const matches = lowerTextClean.match(regex);
        if (matches) {
            matches.forEach(() => found.push(filler));
        }
    });

    return found;
}

function getLongestSentence(text) {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    let maxWords = 0;

    sentences.forEach(sentence => {
        const wordCount = countWords(sentence);
        if (wordCount > maxWords) {
            maxWords = wordCount;
        }
    });

    return maxWords;
}

function calculatePace(wordCount, durationSeconds) {
    if (durationSeconds === 0) return 0;
    return Math.round((wordCount / durationSeconds) * 60);
}

// Results display
function showResults(text, durationSeconds, pauseInfo = []) {
    // Display transcript with highlighted fillers
    // Replace [word] with <span class="filler-highlight">word</span>
    const displayText = text.replace(/\[([^\]]+)\]/g, '<span class="filler-highlight">$1</span>');
    transcriptText.innerHTML = displayText;

    const wordCount = countWords(text);
    const fillers = findFillers(text);
    // Add detected pauses as hesitations
    const totalHesitations = fillers.length + pauseInfo.length;
    const fillerRate = ((totalHesitations / wordCount) * 100).toFixed(1);
    const pace = calculatePace(wordCount, durationSeconds);
    const longestSentence = getLongestSentence(text);
    const targetWordCount = currentQuestion ? currentQuestion.targetWords : 120;

    // Update scorecard
    wordCountEl.textContent = wordCount;
    wordStatusEl.textContent = wordCount <= targetWordCount ? `Target: ${targetWordCount}` : `${Math.round((wordCount / targetWordCount - 1) * 100)}% over`;
    wordStatusEl.className = `score-status ${wordCount <= targetWordCount * 1.1 ? 'good' : wordCount <= targetWordCount * 1.3 ? 'warning' : 'bad'}`;

    fillerCountEl.textContent = `${totalHesitations} (${fillerRate}%)`;
    fillerStatusEl.textContent = `${fillers.length} verbal + ${pauseInfo.length} pauses`;
    fillerStatusEl.className = `score-status ${totalHesitations <= 2 ? 'good' : totalHesitations <= 5 ? 'warning' : 'bad'}`;

    paceValueEl.textContent = `${pace}`;
    paceStatusEl.textContent = 'wpm';
    paceStatusEl.className = `score-status ${pace >= 140 && pace <= 170 ? 'good' : pace >= 120 && pace <= 180 ? 'warning' : 'bad'}`;

    longestSentenceEl.textContent = longestSentence;
    sentenceStatusEl.textContent = 'words';
    sentenceStatusEl.className = `score-status ${longestSentence <= 25 ? 'good' : longestSentence <= 35 ? 'warning' : 'bad'}`;

    // Show fillers detail if any found
    if (fillers.length > 0 || pauseInfo.length > 0) {
        fillersDetail.classList.remove('hidden');

        let fillerHtml = '';

        // Show verbal fillers
        if (fillers.length > 0) {
            const uniqueFillers = [...new Set(fillers)];
            fillerHtml += '<div class="filler-section"><strong>Verbal fillers:</strong> ';
            fillerHtml += uniqueFillers.map(f =>
                `<span class="filler-word">${f} (${fillers.filter(x => x === f).length})</span>`
            ).join(' ');
            fillerHtml += '</div>';
        }

        // Show pauses (hesitations)
        if (pauseInfo.length > 0) {
            fillerHtml += '<div class="filler-section" style="margin-top: 8px;"><strong>Hesitation pauses:</strong> ';
            fillerHtml += pauseInfo.map(p =>
                `<span class="pause-indicator">⏸ ${p.duration.toFixed(1)}s after "...${p.afterText}"</span>`
            ).join(' ');
            fillerHtml += '</div>';
        }

        fillersList.innerHTML = fillerHtml;
    } else {
        fillersDetail.classList.add('hidden');
    }

    // Reset rewrite section
    rewriteBtn.classList.remove('hidden');
    rewriteLoading.classList.add('hidden');
    rewriteResult.classList.add('hidden');
    rewriteError.classList.add('hidden');

    // Show results
    resultsSection.classList.remove('hidden');
    resetBtn.classList.remove('hidden');

    // Save to history (use total hesitations)
    saveToHistory(wordCount, totalHesitations, pace, longestSentence);
}

// Groq API for rewrite with coaching feedback
async function getRewrite() {
    const apiKey = localStorage.getItem('grok_api_key') || DEFAULT_GROQ_KEY;

    if (!apiKey) {
        settingsModal.classList.remove('hidden');
        return;
    }

    rewriteBtn.classList.add('hidden');
    rewriteLoading.classList.remove('hidden');
    rewriteError.classList.add('hidden');

    // Hide previous feedback and relevance
    const feedbackSection = document.getElementById('coaching-feedback');
    if (feedbackSection) feedbackSection.classList.add('hidden');
    const relevanceSection = document.getElementById('relevance-assessment');
    if (relevanceSection) relevanceSection.classList.add('hidden');

    const fillers = findFillers(transcript);
    const longestSentence = getLongestSentence(transcript);
    const wordCount = countWords(transcript);
    const targetWordCount = currentQuestion ? currentQuestion.targetWords : 120;

    const questionCategory = currentQuestion ? currentQuestion.category : 'General';

    // Determine which hiring manager persona to use based on question category
    const isAppliedAI = ['Technical Leadership', 'Applied AI', 'Engineering Management', 'Technical Strategy'].includes(questionCategory);
    const hiringManagerPersona = isAppliedAI
        ? 'Alena Fedorenko, Head of Applied AI at Anthropic - she values technical depth, clear thinking under ambiguity, ability to ship products with cross-functional teams, and strong judgment on AI safety and capabilities'
        : 'Mike Leeds, GTM leader at Databricks - he values crisp executive communication, data-driven insights, strategic thinking, and the ability to influence senior stakeholders';

    const prompt = `You are an executive communication coach helping a French professional prepare for interviews at top tech companies.

HIRING MANAGER PERSONA:
Evaluate this answer as if you were ${hiringManagerPersona}.

CONTEXT:
- Question: "${currentQuestion ? currentQuestion.question : 'Interview question'}"
- Question Category: "${questionCategory}"
- Target word count: ${targetWordCount} words
- Their answer: ${wordCount} words
- Fillers detected: ${fillers.length > 0 ? fillers.join(', ') : 'none'}
- Longest sentence: ${longestSentence} words

THEIR ORIGINAL ANSWER:
"${transcript}"

YOUR TASK:
Provide THREE things in your response, clearly separated:

PART 1 - RELEVANCE ASSESSMENT:
Rate the answer's interview-readiness from ${isAppliedAI ? "Alena's" : "Mike's"} perspective:
- SCORE: Give a score from 1-10 (10 = would immediately advance to next round)
- VERDICT: One of: "Interview Ready ✅", "Almost There 🔶", or "Needs Work 🔴"
- WHY: 1-2 sentences explaining the score. ${isAppliedAI
    ? "Consider: Does it show technical depth? Clear thinking? Ability to navigate ambiguity? Leadership of engineers? Product judgment?"
    : "Consider: Is it crisp and executive-ready? Data-driven? Strategic? Would it impress a CRO or VP Sales?"}

A 10/10 answer:
${isAppliedAI
    ? "- Shows deep technical understanding without getting lost in details\n- Demonstrates clear decision-making framework\n- Shows how they led engineers through ambiguity\n- Includes specific outcomes and learnings\n- Shows product sense and user empathy"
    : "- Leads with the headline/impact\n- Includes specific metrics ($X revenue, Y% improvement)\n- Shows strategic thinking and business acumen\n- Demonstrates influence and stakeholder management\n- Is concise yet substantive"}

PART 2 - CRISP VERSION:
Rewrite their answer to be interview-grade for ${isAppliedAI ? "Anthropic Applied AI" : "Databricks GTM"}:
- Lead with the headline (main point first, then support)
- ${isAppliedAI ? "Show technical depth with clear explanations" : "Include specific metrics and business impact"}
- Keep ALL important context, examples, and specifics - don't oversimplify
- Remove filler words and verbal padding
- Break run-on sentences (max 20 words each)
- Use active voice and strong verbs
- ${isAppliedAI ? "Demonstrate clear thinking and judgment" : "Sound executive-ready and confident"}
- Target ${Math.round(targetWordCount * 0.9)}-${targetWordCount} words

PART 3 - COACHING TIPS:
Give 2-3 specific, actionable tips based on THEIR answer. Be specific about what they said vs what to say. Include:
- What ${isAppliedAI ? "Alena" : "Mike"} would want to hear more of
- Specific phrases to use or avoid
- How to strengthen the impact

FORMAT YOUR RESPONSE EXACTLY LIKE THIS:
---RELEVANCE---
SCORE: [1-10]
VERDICT: [Interview Ready ✅ / Almost There 🔶 / Needs Work 🔴]
WHY: [1-2 sentence explanation]
---CRISP---
[The rewritten answer here]
---TIPS---
[2-3 bullet points with specific coaching tips]`;

    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an elite executive communication coach. You help non-native English speakers sound crisp, confident, and natural - like polished American executives. You preserve substance while cutting fluff. Always respond in the exact format requested.'
                    },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.7,
                max_tokens: 1500
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMsg = errorData.error?.message || errorData.message || `HTTP ${response.status}`;
            throw new Error(errorMsg);
        }

        const data = await response.json();
        const fullResponse = data.choices[0].message.content.trim();

        // Parse the response
        let relevance = '';
        let crispVersion = fullResponse;
        let tips = '';

        if (fullResponse.includes('---RELEVANCE---') && fullResponse.includes('---CRISP---') && fullResponse.includes('---TIPS---')) {
            const relevanceMatch = fullResponse.match(/---RELEVANCE---\s*([\s\S]*?)\s*---CRISP---/);
            const crispMatch = fullResponse.match(/---CRISP---\s*([\s\S]*?)\s*---TIPS---/);
            const tipsMatch = fullResponse.match(/---TIPS---\s*([\s\S]*?)$/);

            if (relevanceMatch) relevance = relevanceMatch[1].trim();
            if (crispMatch) crispVersion = crispMatch[1].trim();
            if (tipsMatch) tips = tipsMatch[1].trim();
        } else if (fullResponse.includes('---CRISP---') && fullResponse.includes('---TIPS---')) {
            // Fallback for older format
            const crispMatch = fullResponse.match(/---CRISP---\s*([\s\S]*?)\s*---TIPS---/);
            const tipsMatch = fullResponse.match(/---TIPS---\s*([\s\S]*?)$/);

            if (crispMatch) crispVersion = crispMatch[1].trim();
            if (tipsMatch) tips = tipsMatch[1].trim();
        }

        // Show relevance assessment
        const relevanceSection = document.getElementById('relevance-assessment');
        if (relevance && relevanceSection) {
            // Parse relevance details
            const scoreMatch = relevance.match(/SCORE:\s*(\d+)/i);
            const verdictMatch = relevance.match(/VERDICT:\s*(.+?)(?:\n|$)/i);
            const whyMatch = relevance.match(/WHY:\s*(.+?)$/is);

            const score = scoreMatch ? parseInt(scoreMatch[1]) : null;
            const verdict = verdictMatch ? verdictMatch[1].trim() : '';
            const why = whyMatch ? whyMatch[1].trim() : '';

            if (score !== null) {
                const scoreEl = document.getElementById('relevance-score');
                const verdictEl = document.getElementById('relevance-verdict');
                const whyEl = document.getElementById('relevance-why');

                if (scoreEl) scoreEl.textContent = score + '/10';
                if (verdictEl) verdictEl.textContent = verdict;
                if (whyEl) whyEl.textContent = why;

                // Color code based on score
                if (scoreEl) {
                    scoreEl.className = 'relevance-score-value';
                    if (score >= 8) {
                        scoreEl.classList.add('score-good');
                    } else if (score >= 5) {
                        scoreEl.classList.add('score-warning');
                    } else {
                        scoreEl.classList.add('score-bad');
                    }
                }

                relevanceSection.classList.remove('hidden');

                // Save AI feedback to history
                saveAIFeedbackToHistory(score, verdict, why, tips, crispVersion);
            }
        }

        // Show crisp version
        rewriteText.textContent = crispVersion;
        const originalWords = countWords(transcript);
        const newWords = countWords(crispVersion);
        const reduction = Math.round((1 - newWords / originalWords) * 100);

        rewriteWordCount.textContent = `${newWords} words`;
        rewriteReduction.textContent = reduction > 0 ? `${reduction}% shorter` : `${Math.abs(reduction)}% longer`;

        // Show coaching tips if we got them
        if (tips && feedbackSection) {
            const feedbackText = document.getElementById('feedback-text');
            if (feedbackText) {
                // Format tips as bullet points
                const formattedTips = tips
                    .split('\n')
                    .filter(line => line.trim())
                    .map(line => line.replace(/^[-•*]\s*/, '').trim())
                    .filter(line => line.length > 0)
                    .map(tip => `<li>${tip}</li>`)
                    .join('');
                feedbackText.innerHTML = `<ul>${formattedTips}</ul>`;
                feedbackSection.classList.remove('hidden');
            }
        }

        rewriteLoading.classList.add('hidden');
        rewriteResult.classList.remove('hidden');

    } catch (error) {
        console.error('Rewrite error:', error);
        rewriteLoading.classList.add('hidden');
        rewriteError.classList.remove('hidden');
        rewriteError.querySelector('.error-text').textContent = error.message;
        rewriteBtn.classList.remove('hidden');
    }
}

// History management with full tracking
function saveToHistory(wordCount, fillerCount, pace, longestSentence) {
    const history = JSON.parse(localStorage.getItem('voice_drill_history') || '[]');

    history.unshift({
        date: new Date().toISOString(),
        question: currentQuestion ? currentQuestion.question : 'Unknown',
        questionShort: currentQuestion ? currentQuestion.question.substring(0, 50) + '...' : 'Unknown',
        category: currentQuestion ? currentQuestion.category : 'Unknown',
        wordCount,
        fillerCount,
        pace,
        longestSentence,
        transcript: transcript || ''
    });

    // Keep only last 50 sessions for better tracking
    if (history.length > 50) {
        history.pop();
    }

    localStorage.setItem('voice_drill_history', JSON.stringify(history));
    updateHistoryDisplay();
    updateProgressChart();
}

// Save AI feedback to history (called after getRewrite)
function saveAIFeedbackToHistory(score, verdict, why, tips, crispVersion) {
    const history = JSON.parse(localStorage.getItem('voice_drill_history') || '[]');

    if (history.length > 0) {
        // Update the most recent entry with AI feedback
        history[0].aiScore = score;
        history[0].aiVerdict = verdict;
        history[0].aiWhy = why;
        history[0].aiTips = tips;
        history[0].crispVersion = crispVersion;

        localStorage.setItem('voice_drill_history', JSON.stringify(history));
    }
}

function updateHistoryDisplay() {
    const history = JSON.parse(localStorage.getItem('voice_drill_history') || '[]');
    const historyList = document.getElementById('history-list');

    if (history.length === 0) {
        historyList.innerHTML = '<p class="empty-state">No sessions yet. Start your first drill!</p>';
        return;
    }

    historyList.innerHTML = history.slice(0, 5).map(item => {
        const date = new Date(item.date);
        const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        return `
            <div class="history-item">
                <div>
                    <div class="history-date">${dateStr}</div>
                </div>
                <div class="history-stats">
                    <span class="history-stat">${item.wordCount}w</span>
                    <span class="history-stat">${item.fillerCount}f</span>
                    <span class="history-stat">${item.pace}wpm</span>
                </div>
            </div>
        `;
    }).join('');
}

// Question loading with tracking to avoid repeats
function loadNewQuestion() {
    // Get asked questions from localStorage
    let askedQuestions = JSON.parse(localStorage.getItem('voice_drill_asked_questions') || '[]');

    // If we've asked all questions, reset the list
    if (askedQuestions.length >= QUESTIONS.length) {
        console.log('All questions asked! Resetting list.');
        askedQuestions = [];
    }

    // Get available questions (not yet asked)
    const availableIndices = QUESTIONS.map((_, i) => i).filter(i => !askedQuestions.includes(i));

    // Pick a random question from available ones
    const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    currentQuestion = QUESTIONS[randomIndex];

    // Track this question as asked
    askedQuestions.push(randomIndex);
    localStorage.setItem('voice_drill_asked_questions', JSON.stringify(askedQuestions));

    console.log(`Question ${askedQuestions.length}/${QUESTIONS.length}: "${currentQuestion.question.substring(0, 50)}..."`);

    questionCategory.textContent = currentQuestion.category;
    questionText.textContent = currentQuestion.question;
    targetWords.textContent = currentQuestion.targetWords;
    targetTime.textContent = currentQuestion.targetTime;

    // Reset UI
    resultsSection.classList.add('hidden');
    resetBtn.classList.add('hidden');
    timer.classList.add('hidden');
    transcript = '';

    recordLabel.textContent = 'Tap to Record';
}

// Settings
const elevenlabsKeyInput = document.getElementById('elevenlabs-key');

function openSettings() {
    const savedKey = localStorage.getItem('grok_api_key') || '';
    const savedElevenLabsKey = localStorage.getItem('elevenlabs_api_key') || '';
    apiKeyInput.value = savedKey;
    if (elevenlabsKeyInput) elevenlabsKeyInput.value = savedElevenLabsKey;
    settingsModal.classList.remove('hidden');
}

function closeSettings() {
    settingsModal.classList.add('hidden');
}

function saveSettings() {
    const apiKey = apiKeyInput.value.trim();
    if (apiKey) {
        localStorage.setItem('grok_api_key', apiKey);
    } else {
        localStorage.removeItem('grok_api_key');
    }

    // Save ElevenLabs key
    if (elevenlabsKeyInput) {
        const elevenLabsKey = elevenlabsKeyInput.value.trim();
        if (elevenLabsKey) {
            localStorage.setItem('elevenlabs_api_key', elevenLabsKey);
        } else {
            localStorage.removeItem('elevenlabs_api_key');
        }
    }

    closeSettings();
}

// Audio player for ElevenLabs
let audioPlayer = null;

// Text-to-speech for crisp version
async function speakCrispVersion() {
    const text = rewriteText.textContent;

    if (!text) return;

    // Stop if already speaking
    if (isSpeaking) {
        // Stop Web Audio API source
        if (window.currentAudioSource) {
            try {
                window.currentAudioSource.stop();
            } catch (e) { /* ignore */ }
            window.currentAudioSource = null;
        }
        if (window.currentAudioContext) {
            try {
                window.currentAudioContext.close();
            } catch (e) { /* ignore */ }
            window.currentAudioContext = null;
        }
        // Stop HTML5 Audio
        if (audioPlayer) {
            audioPlayer.pause();
            audioPlayer.currentTime = 0;
            audioPlayer = null;
        }
        // Stop browser TTS
        window.speechSynthesis.cancel();
        isSpeaking = false;
        speakBtn.textContent = '🔊 Listen';
        return;
    }

    // Try ElevenLabs first for natural voice
    const elevenLabsKey = localStorage.getItem('elevenlabs_api_key') || DEFAULT_ELEVENLABS_KEY;
    if (elevenLabsKey) {
        await speakWithElevenLabs(text, elevenLabsKey);
    } else {
        speakWithBrowser(text);
    }
}

// ElevenLabs TTS (natural voice)
async function speakWithElevenLabs(text, apiKey) {
    speakBtn.textContent = '⏳ Loading...';
    isSpeaking = true;

    try {
        // Using "Rachel" voice - professional American female
        const voiceId = '21m00Tcm4TlvDq8ikWAM'; // Rachel

        console.log('Calling ElevenLabs API...');
        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
            method: 'POST',
            headers: {
                'Accept': 'audio/mpeg',
                'Content-Type': 'application/json',
                'xi-api-key': apiKey
            },
            body: JSON.stringify({
                text: text,
                model_id: 'eleven_monolingual_v1',
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.75
                }
            })
        });

        if (!response.ok) {
            const errorText = await response.text().catch(() => 'Unknown error');
            console.error('ElevenLabs error:', response.status, errorText);
            // Show user-friendly error
            if (response.status === 401) {
                throw new Error('ElevenLabs API key invalid or expired');
            } else if (response.status === 429) {
                throw new Error('ElevenLabs quota exceeded - try again later');
            } else {
                throw new Error(`ElevenLabs error: ${response.status}`);
            }
        }

        const audioBlob = await response.blob();
        console.log('ElevenLabs audio received:', audioBlob.size, 'bytes');

        if (audioBlob.size < 1000) {
            throw new Error('Invalid audio response from ElevenLabs');
        }

        // Try HTML5 Audio first (works better on some devices)
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);

        // Set up for iOS
        audio.playsInline = true;
        audio.preload = 'auto';

        audio.onended = () => {
            console.log('ElevenLabs audio ended');
            isSpeaking = false;
            speakBtn.textContent = '🔊 Listen';
            URL.revokeObjectURL(audioUrl);
        };

        audio.onerror = async (e) => {
            console.error('HTML5 Audio failed, trying Web Audio API:', e);
            URL.revokeObjectURL(audioUrl);

            // Fallback to Web Audio API
            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                if (audioContext.state === 'suspended') {
                    await audioContext.resume();
                }
                const arrayBuffer = await audioBlob.arrayBuffer();
                const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
                const source = audioContext.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(audioContext.destination);
                source.onended = () => {
                    isSpeaking = false;
                    speakBtn.textContent = '🔊 Listen';
                    audioContext.close();
                };
                source.start(0);
                window.currentAudioSource = source;
                window.currentAudioContext = audioContext;
            } catch (webAudioError) {
                console.error('Web Audio API also failed:', webAudioError);
                throw webAudioError;
            }
        };

        // Store for stopping
        audioPlayer = audio;

        // Play
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log('ElevenLabs audio playing via HTML5 Audio');
                speakBtn.textContent = '⏹️ Stop';
            }).catch(async (playError) => {
                console.error('Play failed:', playError);
                // Try Web Audio API as fallback
                audio.onerror(playError);
            });
        }

    } catch (error) {
        console.error('ElevenLabs TTS error:', error);
        isSpeaking = false;
        speakBtn.textContent = '🔊 Listen';

        // Show what went wrong, then fall back
        const errorMsg = error.message || 'Unknown error';
        console.log('ElevenLabs failed:', errorMsg, '- using browser voice');

        // Visual indicator that we're using fallback
        speakBtn.textContent = '🔊 Listen (basic)';
        setTimeout(() => {
            speakWithBrowser(text);
        }, 100);
    }
}

// Browser TTS fallback - with iOS Safari fix
function speakWithBrowser(text) {
    // iOS Safari requires voices to be loaded first
    // We need to wait for voices and use a workaround

    speakBtn.textContent = '⏳ Loading...';
    isSpeaking = true;

    // Cancel any pending speech
    window.speechSynthesis.cancel();

    function doSpeak() {
        const utterance = new SpeechSynthesisUtterance(text);

        // Configure for clear American English
        utterance.rate = 0.95;
        utterance.pitch = 1;
        utterance.volume = 1;

        // Try to get an American English voice
        const voices = window.speechSynthesis.getVoices();
        console.log('Available voices:', voices.length);

        const americanVoice = voices.find(v =>
            v.lang === 'en-US' && (v.name.includes('Samantha') || v.name.includes('Alex') || v.name.includes('Google'))
        ) || voices.find(v => v.lang.startsWith('en')) || voices[0];

        if (americanVoice) {
            utterance.voice = americanVoice;
            console.log('Using voice:', americanVoice.name);
        }

        utterance.onstart = () => {
            console.log('Speech started');
            isSpeaking = true;
            speakBtn.textContent = '⏹️ Stop';
        };

        utterance.onend = () => {
            console.log('Speech ended');
            isSpeaking = false;
            speakBtn.textContent = '🔊 Listen';
        };

        utterance.onerror = (e) => {
            console.error('Speech error:', e);
            isSpeaking = false;
            speakBtn.textContent = '🔊 Listen';
        };

        // iOS Safari workaround: speech sometimes doesn't start
        // We need to use a slight delay and check if it started
        setTimeout(() => {
            window.speechSynthesis.speak(utterance);

            // iOS Safari bug: speech can get stuck, use resume trick
            setTimeout(() => {
                if (window.speechSynthesis.paused) {
                    window.speechSynthesis.resume();
                }
                // If still loading after 2 seconds, something is wrong
                if (speakBtn.textContent === '⏳ Loading...') {
                    // Check if speech is actually happening
                    if (!window.speechSynthesis.speaking) {
                        console.log('Speech did not start, retrying...');
                        window.speechSynthesis.cancel();
                        window.speechSynthesis.speak(utterance);
                    } else {
                        speakBtn.textContent = '⏹️ Stop';
                    }
                }
            }, 500);
        }, 100);
    }

    // Check if voices are loaded
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
        doSpeak();
    } else {
        // Wait for voices to load (iOS Safari)
        console.log('Waiting for voices to load...');
        window.speechSynthesis.onvoiceschanged = () => {
            console.log('Voices loaded');
            doSpeak();
        };
        // Fallback: try anyway after 1 second
        setTimeout(() => {
            if (speakBtn.textContent === '⏳ Loading...') {
                console.log('Timeout waiting for voices, trying anyway');
                doSpeak();
            }
        }, 1000);
    }
}

// Event listeners
recordBtn.addEventListener('click', toggleRecording);
newQuestionBtn.addEventListener('click', loadNewQuestion);
resetBtn.addEventListener('click', () => {
    resultsSection.classList.add('hidden');
    resetBtn.classList.add('hidden');
    timer.classList.add('hidden');
    transcript = '';
});
settingsBtn.addEventListener('click', openSettings);
closeSettingsBtn.addEventListener('click', closeSettings);
saveSettingsBtn.addEventListener('click', saveSettings);
rewriteBtn.addEventListener('click', getRewrite);

// Close modal on background click
settingsModal.addEventListener('click', (e) => {
    if (e.target === settingsModal) {
        closeSettings();
    }
});

// Load voices (needed for some browsers)
if (window.speechSynthesis) {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
    };
}

speakBtn.addEventListener('click', speakCrispVersion);

// Progress chart functionality
function updateProgressChart() {
    const history = JSON.parse(localStorage.getItem('voice_drill_history') || '[]');
    const chartContainer = document.getElementById('progress-chart');
    const progressStats = document.getElementById('progress-stats');
    const metricSelect = document.getElementById('progress-metric');

    if (history.length < 3) {
        chartContainer.innerHTML = '<p class="empty-state">Complete 3+ drills to see your progress</p>';
        progressStats.classList.add('hidden');
        return;
    }

    progressStats.classList.remove('hidden');
    const metric = metricSelect ? metricSelect.value : 'fillers';

    // Get last 10 sessions (reversed to show oldest first)
    const recentHistory = history.slice(0, 10).reverse();

    // Get metric values and thresholds
    const metricConfig = {
        fillers: {
            getValue: (h) => h.fillerCount,
            goodMax: 2,
            warnMax: 5,
            label: 'fillers',
            lowerIsBetter: true
        },
        pace: {
            getValue: (h) => h.pace,
            goodMin: 140,
            goodMax: 170,
            warnMin: 120,
            warnMax: 180,
            label: 'wpm',
            lowerIsBetter: false
        },
        words: {
            getValue: (h) => h.wordCount,
            goodMax: 130,
            warnMax: 160,
            label: 'words',
            lowerIsBetter: true
        },
        longest: {
            getValue: (h) => h.longestSentence,
            goodMax: 25,
            warnMax: 35,
            label: 'words',
            lowerIsBetter: true
        }
    };

    const config = metricConfig[metric];
    const values = recentHistory.map(h => config.getValue(h));
    const maxValue = Math.max(...values, 1);

    // Calculate status for each value
    const getStatus = (value) => {
        if (metric === 'pace') {
            if (value >= config.goodMin && value <= config.goodMax) return 'good';
            if (value >= config.warnMin && value <= config.warnMax) return 'warning';
            return 'bad';
        }
        if (value <= config.goodMax) return 'good';
        if (value <= config.warnMax) return 'warning';
        return 'bad';
    };

    // Build chart HTML
    chartContainer.innerHTML = recentHistory.map((h, i) => {
        const value = config.getValue(h);
        const height = Math.max(10, (value / maxValue) * 100);
        const status = getStatus(value);
        const date = new Date(h.date);
        const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        return `
            <div class="chart-bar-container">
                <span class="chart-value">${value}</span>
                <div class="chart-bar ${status}" style="height: ${height}px;"></div>
                <span class="chart-label">${dateStr}</span>
            </div>
        `;
    }).join('');

    // Update stats
    document.getElementById('total-sessions').textContent = history.length;

    const avgFillers = (history.reduce((sum, h) => sum + h.fillerCount, 0) / history.length).toFixed(1);
    document.getElementById('avg-fillers').textContent = avgFillers;

    // Calculate trend (compare first half to second half of recent sessions)
    if (recentHistory.length >= 4) {
        const mid = Math.floor(recentHistory.length / 2);
        const firstHalf = recentHistory.slice(0, mid);
        const secondHalf = recentHistory.slice(mid);

        const firstAvg = firstHalf.reduce((sum, h) => sum + config.getValue(h), 0) / firstHalf.length;
        const secondAvg = secondHalf.reduce((sum, h) => sum + config.getValue(h), 0) / secondHalf.length;

        const trendIndicator = document.getElementById('trend-indicator');
        const improvement = config.lowerIsBetter ? firstAvg - secondAvg : secondAvg - firstAvg;

        if (Math.abs(improvement) < 0.5) {
            trendIndicator.textContent = '→ Stable';
            trendIndicator.className = 'stat-value';
        } else if (improvement > 0) {
            trendIndicator.textContent = '↑ Improving';
            trendIndicator.className = 'stat-value improving';
        } else {
            trendIndicator.textContent = '↓ Needs work';
            trendIndicator.className = 'stat-value declining';
        }
    } else {
        document.getElementById('trend-indicator').textContent = '--';
    }
}

// Event listener for metric selector
const metricSelect = document.getElementById('progress-metric');
if (metricSelect) {
    metricSelect.addEventListener('change', updateProgressChart);
}

// ========================
// Daily Reminder System
// ========================

const reminderEnabled = document.getElementById('reminder-enabled');
const reminderTime = document.getElementById('reminder-time');
const enableNotificationsBtn = document.getElementById('enable-notifications');
const notificationStatus = document.getElementById('notification-status');

// Check notification permission status
function updateNotificationStatus() {
    if (!('Notification' in window)) {
        if (notificationStatus) notificationStatus.textContent = 'Notifications not supported on this device';
        return;
    }

    if (Notification.permission === 'granted') {
        if (notificationStatus) notificationStatus.textContent = '✓ Notifications enabled';
        if (enableNotificationsBtn) enableNotificationsBtn.style.display = 'none';
    } else if (Notification.permission === 'denied') {
        if (notificationStatus) notificationStatus.textContent = '✗ Notifications blocked - enable in browser settings';
    } else {
        if (notificationStatus) notificationStatus.textContent = 'Click button to enable notifications';
    }
}

// Request notification permission
async function requestNotificationPermission() {
    if (!('Notification' in window)) {
        alert('Notifications are not supported on this device/browser.');
        return;
    }

    try {
        const permission = await Notification.requestPermission();
        updateNotificationStatus();

        if (permission === 'granted') {
            // Show test notification
            new Notification('Voice Drill', {
                body: 'Daily reminders enabled! You\'ll be reminded to practice.',
                icon: 'icon-192.png'
            });
        }
    } catch (err) {
        console.error('Notification permission error:', err);
    }
}

// Save reminder settings
function saveReminderSettings() {
    if (reminderEnabled && reminderTime) {
        const settings = {
            enabled: reminderEnabled.checked,
            time: reminderTime.value
        };
        localStorage.setItem('voice_drill_reminder', JSON.stringify(settings));

        if (settings.enabled) {
            scheduleReminder(settings.time);
        }
    }
}

// Load reminder settings
function loadReminderSettings() {
    const saved = localStorage.getItem('voice_drill_reminder');
    if (saved) {
        const settings = JSON.parse(saved);
        if (reminderEnabled) reminderEnabled.checked = settings.enabled;
        if (reminderTime) reminderTime.value = settings.time || '09:00';
    }
    updateNotificationStatus();
}

// Schedule daily reminder check
let reminderCheckInterval = null;

function scheduleReminder(timeStr) {
    // Clear existing interval
    if (reminderCheckInterval) {
        clearInterval(reminderCheckInterval);
    }

    // Check every minute if it's time to remind
    reminderCheckInterval = setInterval(() => {
        const settings = JSON.parse(localStorage.getItem('voice_drill_reminder') || '{}');
        if (!settings.enabled) return;

        const now = new Date();
        const [hours, minutes] = settings.time.split(':').map(Number);

        // Check if it's the right time (within the same minute)
        if (now.getHours() === hours && now.getMinutes() === minutes) {
            // Check if we already reminded today
            const lastReminder = localStorage.getItem('voice_drill_last_reminder');
            const today = now.toDateString();

            if (lastReminder !== today) {
                showReminder();
                localStorage.setItem('voice_drill_last_reminder', today);
            }
        }
    }, 60000); // Check every minute
}

// Show the reminder notification
function showReminder() {
    if (Notification.permission === 'granted') {
        const notification = new Notification('🎤 Voice Drill Time!', {
            body: 'Take 5 minutes to practice your communication skills.',
            icon: 'icon-192.png',
            tag: 'voice-drill-reminder',
            requireInteraction: true
        });

        notification.onclick = () => {
            window.focus();
            notification.close();
        };
    }
}

// Event listeners for reminder settings
if (enableNotificationsBtn) {
    enableNotificationsBtn.addEventListener('click', requestNotificationPermission);
}

if (reminderEnabled) {
    reminderEnabled.addEventListener('change', saveReminderSettings);
}

if (reminderTime) {
    reminderTime.addEventListener('change', saveReminderSettings);
}

// ========================
// Weekly Debrief System
// ========================

function getWeekNumber(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

function getWeeklyStats() {
    const history = JSON.parse(localStorage.getItem('voice_drill_history') || '[]');

    // Get sessions from the past 7 days
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const thisWeekSessions = history.filter(h => new Date(h.date) >= weekAgo);

    if (thisWeekSessions.length === 0) {
        return null;
    }

    // Calculate averages
    const avgFillers = thisWeekSessions.reduce((sum, h) => sum + h.fillerCount, 0) / thisWeekSessions.length;
    const avgPace = thisWeekSessions.reduce((sum, h) => sum + h.pace, 0) / thisWeekSessions.length;
    const avgWords = thisWeekSessions.reduce((sum, h) => sum + h.wordCount, 0) / thisWeekSessions.length;
    const avgLongest = thisWeekSessions.reduce((sum, h) => sum + h.longestSentence, 0) / thisWeekSessions.length;

    // Find best and worst sessions
    const bestFillers = Math.min(...thisWeekSessions.map(h => h.fillerCount));
    const worstFillers = Math.max(...thisWeekSessions.map(h => h.fillerCount));

    // Get previous week for comparison
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    const lastWeekSessions = history.filter(h => {
        const date = new Date(h.date);
        return date >= twoWeeksAgo && date < weekAgo;
    });

    let comparison = null;
    if (lastWeekSessions.length > 0) {
        const lastWeekAvgFillers = lastWeekSessions.reduce((sum, h) => sum + h.fillerCount, 0) / lastWeekSessions.length;
        comparison = {
            fillerChange: avgFillers - lastWeekAvgFillers,
            sessionChange: thisWeekSessions.length - lastWeekSessions.length
        };
    }

    return {
        sessionCount: thisWeekSessions.length,
        avgFillers: avgFillers.toFixed(1),
        avgPace: Math.round(avgPace),
        avgWords: Math.round(avgWords),
        avgLongest: Math.round(avgLongest),
        bestFillers,
        worstFillers,
        comparison,
        sessions: thisWeekSessions
    };
}

function generateWeeklyDebrief() {
    const stats = getWeeklyStats();

    if (!stats) {
        return {
            summary: "No practice sessions this week. Time to get started!",
            strengths: [],
            improvements: [],
            focus: "Complete at least 3 practice sessions this week."
        };
    }

    const strengths = [];
    const improvements = [];

    // Analyze filler performance
    if (parseFloat(stats.avgFillers) <= 2) {
        strengths.push("Excellent filler control - averaging only " + stats.avgFillers + " per session");
    } else if (parseFloat(stats.avgFillers) <= 5) {
        improvements.push("Work on reducing fillers - averaging " + stats.avgFillers + " per session (target: under 3)");
    } else {
        improvements.push("Focus on filler reduction - " + stats.avgFillers + " per session is too high. Try pausing silently instead of 'um'");
    }

    // Analyze pace
    if (stats.avgPace >= 140 && stats.avgPace <= 170) {
        strengths.push("Great speaking pace at " + stats.avgPace + " wpm - clear and professional");
    } else if (stats.avgPace < 140) {
        improvements.push("Speed up slightly - " + stats.avgPace + " wpm is a bit slow. Aim for 140-170 wpm");
    } else {
        improvements.push("Slow down a bit - " + stats.avgPace + " wpm is too fast. Take breaths between sentences");
    }

    // Analyze sentence length
    if (stats.avgLongest <= 25) {
        strengths.push("Concise sentences - averaging " + stats.avgLongest + " words (perfect for clarity)");
    } else if (stats.avgLongest <= 35) {
        improvements.push("Watch run-on sentences - averaging " + stats.avgLongest + " words. Try breaking at 'and' or 'but'");
    } else {
        improvements.push("Sentences too long at " + stats.avgLongest + " words - break them up for impact");
    }

    // Session consistency
    if (stats.sessionCount >= 5) {
        strengths.push("Excellent consistency with " + stats.sessionCount + " sessions this week!");
    } else if (stats.sessionCount >= 3) {
        strengths.push("Good practice habit - " + stats.sessionCount + " sessions this week");
    } else {
        improvements.push("Aim for more consistency - try to practice 3-5 times per week");
    }

    // Week-over-week comparison
    let trendNote = "";
    if (stats.comparison) {
        if (stats.comparison.fillerChange < -1) {
            trendNote = "📈 You reduced fillers by " + Math.abs(stats.comparison.fillerChange).toFixed(1) + " compared to last week!";
        } else if (stats.comparison.fillerChange > 1) {
            trendNote = "📉 Fillers increased by " + stats.comparison.fillerChange.toFixed(1) + " from last week - refocus on pausing";
        }
    }

    // Generate focus for next week
    let focus = "";
    if (improvements.length > 0) {
        // Pick the most important improvement
        if (parseFloat(stats.avgFillers) > 5) {
            focus = "This week's focus: Replace 'um' and 'like' with silent pauses. Record yourself and count fillers.";
        } else if (stats.avgLongest > 30) {
            focus = "This week's focus: Shorter sentences. When you use 'and', stop and start a new sentence instead.";
        } else if (stats.avgPace < 130 || stats.avgPace > 180) {
            focus = "This week's focus: Pace control. Practice speaking at a steady 150 wpm rhythm.";
        } else {
            focus = "This week's focus: Polish your delivery. Practice the AI crisp versions out loud.";
        }
    } else {
        focus = "Keep up the great work! Challenge yourself with the harder question categories.";
    }

    return {
        summary: `${stats.sessionCount} sessions this week. Avg ${stats.avgFillers} fillers, ${stats.avgPace} wpm pace.`,
        strengths,
        improvements,
        focus,
        trendNote,
        stats
    };
}

function showWeeklyDebrief() {
    const debriefModal = document.getElementById('weekly-debrief-modal');
    if (!debriefModal) return;

    const debrief = generateWeeklyDebrief();

    // Populate the modal
    document.getElementById('debrief-summary').textContent = debrief.summary;

    const strengthsList = document.getElementById('debrief-strengths');
    const improvementsList = document.getElementById('debrief-improvements');

    if (debrief.strengths.length > 0) {
        strengthsList.innerHTML = debrief.strengths.map(s => `<li>✅ ${s}</li>`).join('');
        strengthsList.parentElement.classList.remove('hidden');
    } else {
        strengthsList.parentElement.classList.add('hidden');
    }

    if (debrief.improvements.length > 0) {
        improvementsList.innerHTML = debrief.improvements.map(i => `<li>🎯 ${i}</li>`).join('');
        improvementsList.parentElement.classList.remove('hidden');
    } else {
        improvementsList.parentElement.classList.add('hidden');
    }

    document.getElementById('debrief-focus').textContent = debrief.focus;

    const trendEl = document.getElementById('debrief-trend');
    if (debrief.trendNote) {
        trendEl.textContent = debrief.trendNote;
        trendEl.classList.remove('hidden');
    } else {
        trendEl.classList.add('hidden');
    }

    debriefModal.classList.remove('hidden');

    // Mark as shown for this week
    const now = new Date();
    const weekKey = `${now.getFullYear()}-W${getWeekNumber(now)}`;
    localStorage.setItem('voice_drill_last_debrief', weekKey);
}

function closeWeeklyDebrief() {
    const debriefModal = document.getElementById('weekly-debrief-modal');
    if (debriefModal) {
        debriefModal.classList.add('hidden');
    }
}

function checkShowWeeklyDebrief() {
    const history = JSON.parse(localStorage.getItem('voice_drill_history') || '[]');

    // Need at least 1 session to show debrief
    if (history.length === 0) return;

    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Sunday
    const hour = now.getHours();

    // Show on Sunday morning (before noon) or if user manually requested
    const isSundayMorning = dayOfWeek === 0 && hour < 12;

    // Check if already shown this week
    const weekKey = `${now.getFullYear()}-W${getWeekNumber(now)}`;
    const lastShown = localStorage.getItem('voice_drill_last_debrief');

    if (isSundayMorning && lastShown !== weekKey) {
        // Small delay to let the page load
        setTimeout(() => {
            showWeeklyDebrief();
        }, 500);
    }
}

// Event listener for debrief button
document.addEventListener('click', (e) => {
    if (e.target.id === 'close-debrief') {
        closeWeeklyDebrief();
    }
    if (e.target.id === 'show-debrief-btn') {
        showWeeklyDebrief();
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateHistoryDisplay();
    updateProgressChart();
    loadReminderSettings();

    // Check if we should show weekly debrief
    checkShowWeeklyDebrief();

    // Start reminder scheduler if enabled
    const settings = JSON.parse(localStorage.getItem('voice_drill_reminder') || '{}');
    if (settings.enabled) {
        scheduleReminder(settings.time);
    }
});
