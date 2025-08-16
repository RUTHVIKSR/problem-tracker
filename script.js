document.addEventListener('DOMContentLoaded', () => {

    const problemForm = document.getElementById('problem-form');
    const problemsTableBody = document.getElementById('problems-table-body');
    const themeSwitcher = document.getElementById('theme-switcher');
    
    // Modal elements
    const modal = document.getElementById('problem-modal');
    const openModalBtn = document.getElementById('open-modal-btn');
    const closeModalBtn = document.querySelector('.close-btn');

    // --- Theme Switcher Logic ---
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
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    setTheme(savedTheme === 'dark');

    themeSwitcher.addEventListener('change', () => {
        setTheme(themeSwitcher.checked);
    });
    
    // --- Modal Logic ---
    openModalBtn.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    closeModalBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Close modal if user clicks outside of the modal content
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // --- Problem Data Logic ---
    const loadProblems = () => {
        const problems = JSON.parse(localStorage.getItem('problems')) || [];
        problemsTableBody.innerHTML = '';
        // Add an index to each problem so we can identify them
        problems.forEach((problem, index) => addProblemToTable(problem, index));
    };

    const addProblemToTable = (problem) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${problem.id}</td>
            <td>${problem.difficulty}</td>
            <td>${problem.status}</td>
            <td>${problem.topics}</td>
            <td>${problem.metacognition}</td>
            <td>${problem.takeaways}</td>
            <td>${problem.analysis}</td>
        `;
        problemsTableBody.appendChild(row);
    };

    problemForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const newProblem = {
            id: document.getElementById('problem-id').value,
            difficulty: document.getElementById('problem-difficulty').value,
            status: document.getElementById('problem-status').value,
            topics: document.getElementById('problem-topics').value,
            metacognition: document.getElementById('problem-metacognition').value,
            takeaways: document.getElementById('problem-takeaways').value,
            analysis: document.getElementById('problem-analysis').value,
        };

        const problems = JSON.parse(localStorage.getItem('problems')) || [];
        problems.push(newProblem);
        localStorage.setItem('problems', JSON.stringify(problems));
        
        addProblemToTable(newProblem);
        problemForm.reset();
        
        // Close the modal after submission
        modal.style.display = 'none';
    });

    // Initial load of problems
    loadProblems();
});