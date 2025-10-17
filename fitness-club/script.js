// Fitness Club JavaScript
class FitnessClub {
    constructor() {
        this.currentUser = null;
        this.exercises = [];
        this.workoutData = {};
        this.leaderboard = [];
        this.currentExercise = null;
        
        this.init();
    }

    init() {
        this.loadData();
        this.setupEventListeners();
        this.populateExercises();
        this.updateUI();
        this.setupNavigation();
    }

    setupEventListeners() {
        // Mobile navigation
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
        }

        // Search functionality
        const searchInput = document.getElementById('exerciseSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterExercises(e.target.value);
            });
        }

        // Filter buttons
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                filterButtons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.filterExercisesByCategory(e.target.dataset.category);
            });
        });

        // Close modals when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target.id);
            }
        });
    }

    setupNavigation() {
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Update active navigation link on scroll
        window.addEventListener('scroll', () => {
            const sections = document.querySelectorAll('section[id]');
            const navLinks = document.querySelectorAll('.nav-link');
            
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (scrollY >= (sectionTop - 200)) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }

    loadData() {
        // Load user data from localStorage
        const savedData = localStorage.getItem('fitnessClubData');
        if (savedData) {
            const data = JSON.parse(savedData);
            this.currentUser = data.currentUser || null;
            this.workoutData = data.workoutData || {};
            this.leaderboard = data.leaderboard || [];
        }

        // Initialize exercises data
        this.initializeExercises();
        
        // Initialize leaderboard if empty
        if (this.leaderboard.length === 0) {
            this.initializeLeaderboard();
        }
    }

    saveData() {
        const data = {
            currentUser: this.currentUser,
            workoutData: this.workoutData,
            leaderboard: this.leaderboard
        };
        localStorage.setItem('fitnessClubData', JSON.stringify(data));
    }

    initializeExercises() {
        this.exercises = [
            // Chest Exercises
            { id: 1, name: 'Bench Press', category: 'chest', muscle: 'Chest', difficulty: 'Intermediate' },
            { id: 2, name: 'Incline Dumbbell Press', category: 'chest', muscle: 'Chest', difficulty: 'Intermediate' },
            { id: 3, name: 'Push-ups', category: 'chest', muscle: 'Chest', difficulty: 'Beginner' },
            { id: 4, name: 'Chest Flyes', category: 'chest', muscle: 'Chest', difficulty: 'Beginner' },
            { id: 5, name: 'Dips', category: 'chest', muscle: 'Chest', difficulty: 'Intermediate' },
            { id: 6, name: 'Decline Bench Press', category: 'chest', muscle: 'Chest', difficulty: 'Advanced' },
            
            // Back Exercises
            { id: 7, name: 'Deadlift', category: 'back', muscle: 'Back', difficulty: 'Advanced' },
            { id: 8, name: 'Pull-ups', category: 'back', muscle: 'Back', difficulty: 'Intermediate' },
            { id: 9, name: 'Bent-over Rows', category: 'back', muscle: 'Back', difficulty: 'Intermediate' },
            { id: 10, name: 'Lat Pulldowns', category: 'back', muscle: 'Back', difficulty: 'Beginner' },
            { id: 11, name: 'T-Bar Rows', category: 'back', muscle: 'Back', difficulty: 'Intermediate' },
            { id: 12, name: 'Cable Rows', category: 'back', muscle: 'Back', difficulty: 'Beginner' },
            
            // Leg Exercises
            { id: 13, name: 'Squats', category: 'legs', muscle: 'Legs', difficulty: 'Beginner' },
            { id: 14, name: 'Leg Press', category: 'legs', muscle: 'Legs', difficulty: 'Beginner' },
            { id: 15, name: 'Lunges', category: 'legs', muscle: 'Legs', difficulty: 'Beginner' },
            { id: 16, name: 'Romanian Deadlifts', category: 'legs', muscle: 'Legs', difficulty: 'Intermediate' },
            { id: 17, name: 'Leg Curls', category: 'legs', muscle: 'Legs', difficulty: 'Beginner' },
            { id: 18, name: 'Calf Raises', category: 'legs', muscle: 'Legs', difficulty: 'Beginner' },
            
            // Arm Exercises
            { id: 19, name: 'Bicep Curls', category: 'arms', muscle: 'Biceps', difficulty: 'Beginner' },
            { id: 20, name: 'Tricep Dips', category: 'arms', muscle: 'Triceps', difficulty: 'Intermediate' },
            { id: 21, name: 'Hammer Curls', category: 'arms', muscle: 'Biceps', difficulty: 'Beginner' },
            { id: 22, name: 'Tricep Extensions', category: 'arms', muscle: 'Triceps', difficulty: 'Beginner' },
            { id: 23, name: 'Preacher Curls', category: 'arms', muscle: 'Biceps', difficulty: 'Intermediate' },
            { id: 24, name: 'Close-Grip Bench Press', category: 'arms', muscle: 'Triceps', difficulty: 'Intermediate' },
            
            // Shoulder Exercises
            { id: 25, name: 'Overhead Press', category: 'shoulders', muscle: 'Shoulders', difficulty: 'Intermediate' },
            { id: 26, name: 'Lateral Raises', category: 'shoulders', muscle: 'Shoulders', difficulty: 'Beginner' },
            { id: 27, name: 'Front Raises', category: 'shoulders', muscle: 'Shoulders', difficulty: 'Beginner' },
            { id: 28, name: 'Rear Delt Flyes', category: 'shoulders', muscle: 'Shoulders', difficulty: 'Beginner' },
            { id: 29, name: 'Arnold Press', category: 'shoulders', muscle: 'Shoulders', difficulty: 'Intermediate' },
            { id: 30, name: 'Upright Rows', category: 'shoulders', muscle: 'Shoulders', difficulty: 'Intermediate' },
            
            // Core Exercises
            { id: 31, name: 'Plank', category: 'core', muscle: 'Core', difficulty: 'Beginner' },
            { id: 32, name: 'Crunches', category: 'core', muscle: 'Core', difficulty: 'Beginner' },
            { id: 33, name: 'Russian Twists', category: 'core', muscle: 'Core', difficulty: 'Beginner' },
            { id: 34, name: 'Mountain Climbers', category: 'core', muscle: 'Core', difficulty: 'Intermediate' },
            { id: 35, name: 'Leg Raises', category: 'core', muscle: 'Core', difficulty: 'Intermediate' },
            { id: 36, name: 'Bicycle Crunches', category: 'core', muscle: 'Core', difficulty: 'Beginner' },
            
            // Cardio Exercises
            { id: 37, name: 'Running', category: 'cardio', muscle: 'Full Body', difficulty: 'Beginner' },
            { id: 38, name: 'Cycling', category: 'cardio', muscle: 'Legs', difficulty: 'Beginner' },
            { id: 39, name: 'Jump Rope', category: 'cardio', muscle: 'Full Body', difficulty: 'Intermediate' },
            { id: 40, name: 'Burpees', category: 'cardio', muscle: 'Full Body', difficulty: 'Advanced' },
            { id: 41, name: 'High Knees', category: 'cardio', muscle: 'Legs', difficulty: 'Beginner' },
            { id: 42, name: 'Jumping Jacks', category: 'cardio', muscle: 'Full Body', difficulty: 'Beginner' },
            
            // Additional Exercises
            { id: 43, name: 'Pull-ups (Wide Grip)', category: 'back', muscle: 'Back', difficulty: 'Advanced' },
            { id: 44, name: 'Diamond Push-ups', category: 'chest', muscle: 'Chest', difficulty: 'Advanced' }
        ];
    }

    initializeLeaderboard() {
        this.leaderboard = [
            { name: 'Sarah M.', totalStrength: 1200, rank: 'Gold', userId: 'user1' },
            { name: 'Mike R.', totalStrength: 1800, rank: 'Platinum', userId: 'user2' },
            { name: 'Alex T.', totalStrength: 800, rank: 'Silver', userId: 'user3' },
            { name: 'Guest', totalStrength: 0, rank: 'Bronze', userId: 'guest' }
        ];
        this.saveData();
    }

    populateExercises() {
        const exercisesGrid = document.getElementById('exercisesGrid');
        if (!exercisesGrid) return;

        exercisesGrid.innerHTML = '';
        
        this.exercises.forEach(exercise => {
            const exerciseData = this.workoutData[exercise.id] || { weight: 0, sets: 0, reps: 0 };
            const totalVolume = exerciseData.weight * exerciseData.sets * exerciseData.reps;
            
            const exerciseCard = document.createElement('div');
            exerciseCard.className = 'exercise-card';
            exerciseCard.onclick = () => this.openExerciseModal(exercise);
            
            exerciseCard.innerHTML = `
                <div class="exercise-header">
                    <div class="exercise-name">${exercise.name}</div>
                    <div class="exercise-category">${exercise.category}</div>
                </div>
                <div class="exercise-stats">
                    <div class="exercise-stat">
                        <span class="exercise-stat-value">${exerciseData.weight || 0}</span>
                        <span class="exercise-stat-label">Weight (lbs)</span>
                    </div>
                    <div class="exercise-stat">
                        <span class="exercise-stat-value">${exerciseData.sets || 0}</span>
                        <span class="exercise-stat-label">Sets</span>
                    </div>
                    <div class="exercise-stat">
                        <span class="exercise-stat-value">${exerciseData.reps || 0}</span>
                        <span class="exercise-stat-label">Reps</span>
                    </div>
                </div>
                <div class="exercise-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${Math.min((totalVolume / 1000) * 100, 100)}%"></div>
                    </div>
                </div>
            `;
            
            exercisesGrid.appendChild(exerciseCard);
        });
    }

    filterExercises(searchTerm) {
        const exercises = document.querySelectorAll('.exercise-card');
        const term = searchTerm.toLowerCase();
        
        exercises.forEach(card => {
            const exerciseName = card.querySelector('.exercise-name').textContent.toLowerCase();
            const exerciseCategory = card.querySelector('.exercise-category').textContent.toLowerCase();
            
            if (exerciseName.includes(term) || exerciseCategory.includes(term)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    filterExercisesByCategory(category) {
        const exercises = document.querySelectorAll('.exercise-card');
        
        exercises.forEach(card => {
            const exerciseCategory = card.querySelector('.exercise-category').textContent.toLowerCase();
            
            if (category === 'all' || exerciseCategory === category) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    openExerciseModal(exercise) {
        this.currentExercise = exercise;
        const modal = document.getElementById('exerciseModal');
        const modalTitle = document.getElementById('modalExerciseName');
        
        if (modalTitle) {
            modalTitle.textContent = exercise.name;
        }
        
        // Load existing data
        const exerciseData = this.workoutData[exercise.id] || { weight: 0, sets: 0, reps: 0 };
        document.getElementById('exerciseWeight').value = exerciseData.weight;
        document.getElementById('exerciseSets').value = exerciseData.sets;
        document.getElementById('exerciseReps').value = exerciseData.reps;
        
        this.showModal('exerciseModal');
    }

    saveExerciseData() {
        if (!this.currentExercise) return;
        
        const weight = parseFloat(document.getElementById('exerciseWeight').value) || 0;
        const sets = parseInt(document.getElementById('exerciseSets').value) || 0;
        const reps = parseInt(document.getElementById('exerciseReps').value) || 0;
        
        this.workoutData[this.currentExercise.id] = { weight, sets, reps };
        this.saveData();
        this.updateUI();
        this.populateExercises();
        this.closeModal('exerciseModal');
        
        // Show success message
        this.showNotification('Exercise data saved successfully!', 'success');
    }

    updateUI() {
        // Calculate total strength
        let totalStrength = 0;
        Object.values(this.workoutData).forEach(data => {
            totalStrength += (data.weight || 0) * (data.sets || 0) * (data.reps || 0);
        });
        
        // Update total strength display
        const totalStrengthElement = document.getElementById('totalStrength');
        if (totalStrengthElement) {
            totalStrengthElement.textContent = `${totalStrength} lbs`;
        }
        
        // Update account stats
        const accountTotalStrength = document.getElementById('accountTotalStrength');
        if (accountTotalStrength) {
            accountTotalStrength.textContent = totalStrength;
        }
        
        // Update rank
        const rank = this.calculateRank(totalStrength);
        const rankElement = document.getElementById('accountRank');
        if (rankElement) {
            rankElement.textContent = rank;
        }
        
        // Update leaderboard
        this.updateLeaderboard();
    }

    calculateRank(totalStrength) {
        if (totalStrength >= 10000) return 'Diamond';
        if (totalStrength >= 7500) return 'Platinum';
        if (totalStrength >= 5000) return 'Gold';
        if (totalStrength >= 2500) return 'Silver';
        if (totalStrength >= 1000) return 'Bronze';
        return 'Rookie';
    }

    updateLeaderboard() {
        const leaderboardEntries = document.getElementById('leaderboardEntries');
        if (!leaderboardEntries) return;
        
        // Sort leaderboard by total strength
        const sortedLeaderboard = [...this.leaderboard].sort((a, b) => b.totalStrength - a.totalStrength);
        
        leaderboardEntries.innerHTML = '';
        
        sortedLeaderboard.forEach((entry, index) => {
            const entryElement = document.createElement('div');
            entryElement.className = 'leaderboard-entry';
            if (entry.userId === 'guest') {
                entryElement.classList.add('current-user');
            }
            
            entryElement.innerHTML = `
                <span class="rank-number">${index + 1}</span>
                <span>${entry.name}</span>
                <span>${entry.totalStrength} lbs</span>
                <span class="rank-tier">${entry.rank}</span>
            `;
            
            leaderboardEntries.appendChild(entryElement);
        });
    }

    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('show');
            modal.style.display = 'flex';
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('show');
            modal.style.display = 'none';
        }
    }

    createAccount() {
        const fullName = document.getElementById('createFullName').value;
        const email = document.getElementById('createEmail').value;
        const password = document.getElementById('createPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (!fullName || !email || !password || !confirmPassword) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }
        
        if (password !== confirmPassword) {
            this.showNotification('Passwords do not match', 'error');
            return;
        }
        
        this.currentUser = {
            name: fullName,
            email: email,
            totalStrength: 0,
            rank: 'Bronze'
        };
        
        this.saveData();
        this.updateUI();
        this.closeModal('createAccountModal');
        this.showNotification('Account created successfully!', 'success');
    }

    login() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        if (!email || !password) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }
        
        // Simple login logic (in real app, this would validate against server)
        this.currentUser = {
            name: 'Logged In User',
            email: email,
            totalStrength: 0,
            rank: 'Bronze'
        };
        
        this.saveData();
        this.updateUI();
        this.closeModal('loginModal');
        this.showNotification('Logged in successfully!', 'success');
    }

    clearAllData() {
        if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
            localStorage.removeItem('fitnessClubData');
            this.currentUser = null;
            this.workoutData = {};
            this.leaderboard = [];
            this.initializeLeaderboard();
            this.updateUI();
            this.populateExercises();
            this.showNotification('All data cleared successfully', 'success');
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            z-index: 3000;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Global functions for HTML onclick events
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

function showModal(modalId) {
    fitnessApp.showModal(modalId);
}

function closeModal(modalId) {
    fitnessApp.closeModal(modalId);
}

function saveExerciseData() {
    fitnessApp.saveExerciseData();
}

function createAccount() {
    fitnessApp.createAccount();
}

function login() {
    fitnessApp.login();
}

function clearAllData() {
    fitnessApp.clearAllData();
}

function processPayment() {
    fitnessApp.showNotification('Payment processing would be implemented here', 'info');
    closeModal('paymentModal');
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize the app
let fitnessApp;
document.addEventListener('DOMContentLoaded', function() {
    fitnessApp = new FitnessClub();
    console.log('🏋️ Fitness Club App Initialized! 🏋️');
});
