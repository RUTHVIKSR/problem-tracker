document.addEventListener('DOMContentLoaded', () => {
    // --- Universal Elements & Functions ---
    const themeSwitcher = document.getElementById('theme-switcher');

    // Theme switcher logic (remains the same)
    const setTheme = (isDark) => {
        if (isDark) {
            document.body.classList.add('dark-mode');
            themeSwitcher.checked = true;
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark-mode');
            themeSwitcher.checked = false;
            localStorage.setItem('theme', 'light');
        }
    };

    const savedTheme = localStorage.getItem('theme');
    setTheme(savedTheme === 'dark');
    themeSwitcher.addEventListener('change', () => setTheme(themeSwitcher.checked));

    // --- Data Management Functions ---
    const getFromStorage = (key) => JSON.parse(localStorage.getItem(key)) || [];
    const saveToStorage = (key, data) => localStorage.setItem(key, JSON.stringify(data));

    // =================================================================
    // PAGE: Problems (index.html)
    // =================================================================
    if (document.getElementById('problems-table')) {
        const modal = document.getElementById('problem-modal');
        const openModalBtn = document.getElementById('open-modal-btn');
        const closeModalBtn = modal.querySelector('.close-btn');
        const problemForm = document.getElementById('problem-form');
        const problemsTableBody = document.getElementById('problems-table-body');
        const patternsSelect = document.getElementById('problem-patterns');

        // Load patterns into the dropdown
        const loadPatternsIntoSelect = () => {
            const patterns = getFromStorage('patterns');
            patternsSelect.innerHTML = '';
            patterns.forEach(pattern => {
                const option = document.createElement('option');
                option.value = pattern;
                option.textContent = pattern;
                patternsSelect.appendChild(option);
            });
        };
        
        const renderProblems = () => {
            const problems = getFromStorage('problems');
            problemsTableBody.innerHTML = '';
            problems.forEach((problem, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><a href="${problem.id}" target="_blank">${problem.id}</a></td>
                    <td>${problem.difficulty}</td>
                    <td>${problem.status}</td>
                    <td>${problem.patterns.join(', ')}</td>
                    <td>${problem.analysis.substring(0, 50)}...</td>
                    <td>
                        <button class="action-btn delete-problem-btn" data-index="${index}">Delete</button>
                    </td>
                `;
                problemsTableBody.appendChild(row);
            });
        };

        problemForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newProblem = {
                id: document.getElementById('problem-id').value,
                difficulty: document.getElementById('problem-difficulty').value,
                status: document.getElementById('problem-status').value,
                patterns: Array.from(patternsSelect.selectedOptions).map(opt => opt.value),
                metacognition: document.getElementById('problem-metacognition').value,
                takeaways: document.getElementById('problem-takeaways').value,
                analysis: document.getElementById('problem-analysis').value,
            };
            const problems = getFromStorage('problems');
            problems.push(newProblem);
            saveToStorage('problems', problems);
            renderProblems();
            problemForm.reset();
            modal.style.display = 'none';
        });

        problemsTableBody.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-problem-btn')) {
                const index = e.target.dataset.index;
                if (confirm('Are you sure you want to delete this problem?')) {
                    const problems = getFromStorage('problems');
                    problems.splice(index, 1);
                    saveToStorage('problems', problems);
                    renderProblems();
                }
            }
        });
        
        openModalBtn.addEventListener('click', () => {
            loadPatternsIntoSelect();
            modal.style.display = 'block';
        });
        closeModalBtn.addEventListener('click', () => modal.style.display = 'none');
        window.addEventListener('click', (e) => {
            if (e.target === modal) modal.style.display = 'none';
        });

        renderProblems();
    }

    // =================================================================
    // PAGE: Patterns (patterns.html)
    // =================================================================
    if (document.getElementById('patterns-list')) {
        const patternForm = document.getElementById('add-pattern-form');
        const patternInput = document.getElementById('pattern-name');
        const patternsList = document.getElementById('patterns-list');

        const renderPatterns = () => {
            const patterns = getFromStorage('patterns');
            patternsList.innerHTML = '';
            patterns.forEach((pattern, index) => {
                const tag = document.createElement('div');
                tag.className = 'pattern-tag';
                tag.innerHTML = `
                    <span>${pattern}</span>
                    <button class="delete-btn" data-index="${index}">X</button>
                `;
                patternsList.appendChild(tag);
            });
        };

        patternForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newPattern = patternInput.value.trim();
            if (newPattern) {
                const patterns = getFromStorage('patterns');
                if (!patterns.includes(newPattern)) {
                    patterns.push(newPattern);
                    saveToStorage('patterns', patterns);
                    renderPatterns();
                }
                patternInput.value = '';
            }
        });
        
        patternsList.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-btn')) {
                const index = e.target.dataset.index;
                const patterns = getFromStorage('patterns');
                patterns.splice(index, 1);
                saveToStorage('patterns', patterns);
                renderPatterns();
            }
        });

        renderPatterns();
    }

    // =================================================================
    // PAGE: Templates (templates.html)
    // =================================================================
    if (document.getElementById('templates-container')) {
        const modal = document.getElementById('template-modal');
        const openModalBtn = document.getElementById('open-modal-btn');
        const closeModalBtn = modal.querySelector('.close-btn');
        const templateForm = document.getElementById('template-form');
        const templatesContainer = document.getElementById('templates-container');

        const renderTemplates = () => {
            const templates = getFromStorage('templates');
            templatesContainer.innerHTML = '';
            templates.forEach((template, index) => {
                const card = document.createElement('div');
                card.className = 'template-card';
                card.innerHTML = `
                    <h3>
                        ${template.title}
                        <button class="delete-btn" data-index="${index}">X</button>
                    </h3>
                    <pre><code>${template.code.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre>
                `;
                templatesContainer.appendChild(card);
            });
        };

        templateForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newTemplate = {
                title: document.getElementById('template-title').value,
                code: document.getElementById('template-code').value,
            };
            const templates = getFromStorage('templates');
            templates.push(newTemplate);
            saveToStorage('templates', templates);
            renderTemplates();
            templateForm.reset();
            modal.style.display = 'none';
        });

        templatesContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-btn')) {
                const index = e.target.dataset.index;
                if (confirm('Are you sure you want to delete this template?')) {
                    const templates = getFromStorage('templates');
                    templates.splice(index, 1);
                    saveToStorage('templates', templates);
                    renderTemplates();
                }
            }
        });

        openModalBtn.addEventListener('click', () => modal.style.display = 'block');
        closeModalBtn.addEventListener('click', () => modal.style.display = 'none');
        window.addEventListener('click', (e) => {
            if (e.target === modal) modal.style.display = 'none';
        });

        renderTemplates();
    }
});