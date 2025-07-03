// GPA Calculator JavaScript

class GPACalculator {
    constructor() {
        this.courses = [];
        this.currentAcademicYear = 'first';
        this.currentSemester = 'all';
        this.isDarkMode = false;
        
        // Grade scale mapping based on your university system
        this.gradeScale = {
            'A+': { points: 4.0, minMarks: 90 },
            'A': { points: 3.7, minMarks: 85 },
            'A-': { points: 3.3, minMarks: 80 },
            'B+': { points: 3.0, minMarks: 75 },
            'B': { points: 2.7, minMarks: 70 },
            'B-': { points: 2.3, minMarks: 65 },
            'C+': { points: 2.6, minMarks: 60 },
            'C': { points: 2.4, minMarks: 55 },
            'C-': { points: 2.2, minMarks: 50 },
            'D+': { points: 2.0, minMarks: 45 },
            'D': { points: 1.5, minMarks: 40 },
            'D-': { points: 1.0, minMarks: 35 },
            'F': { points: 0.0, minMarks: 0 }
        };
        
        // Course icons for different subjects
        this.courseIcons = {
            'mathematics': 'fas fa-calculator',
            'physics': 'fas fa-atom',
            'computers': 'fas fa-laptop',
            'programming': 'fas fa-code',
            'logic': 'fas fa-microchip',
            'english': 'fas fa-language',
            'statistics': 'fas fa-chart-bar',
            'discrete': 'fas fa-project-diagram',
            'information': 'fas fa-database',
            'social': 'fas fa-users',
            'ethics': 'fas fa-balance-scale',
            'management': 'fas fa-tasks',
            'default': 'fas fa-book'
        };
        
        this.initializeApp();
    }
    
    initializeApp() {
        this.loadSavedData();
        this.setupEventListeners();
        this.loadDefaultCourses();
        this.updateDisplay();
    }
    
    setupEventListeners() {
        // Academic year selection
        document.getElementById('academicYear').addEventListener('change', (e) => {
            this.currentAcademicYear = e.target.value;
            this.updateDisplay();
            this.saveData();
        });
        
        // Semester buttons
        document.getElementById('springBtn').addEventListener('click', () => {
            this.filterSemester('spring');
        });
        
        document.getElementById('fallBtn').addEventListener('click', () => {
            this.filterSemester('fall');
        });
        
        // Dark mode toggle
        document.getElementById('toggleDarkMode').addEventListener('click', () => {
            this.toggleDarkMode();
        });
        
        // Reset all data
        document.getElementById('resetAllData').addEventListener('click', () => {
            this.resetAllData();
        });
        
        // Add course button
        document.getElementById('addCourse').addEventListener('click', () => {
            this.addCourse();
        });
    }
    
    loadDefaultCourses() {
        if (this.courses.length === 0) {
            const defaultCourses = [
                // 2024 - SPRING
                { name: 'BAS 103 - Physics', credits: 3, marks: 73, icon: 'physics', semester: 'spring' },
                { name: 'COM 101 - Introduction to Computers', credits: 3, marks: 53, icon: 'computers', semester: 'spring' },
                { name: 'COM 104 - Logic Design', credits: 3, marks: 38, icon: 'logic', semester: 'spring' },
                { name: 'GEN 102 - English II', credits: 2, marks: 83, icon: 'english', semester: 'spring' },
                // 2024 - FALL
                { name: 'BAS 101 - Mathematics', credits: 3, marks: 59, icon: 'mathematics', semester: 'fall' },
                { name: 'BAS 102 - Discrete Mathematics', credits: 3, marks: 57, icon: 'discrete', semester: 'fall' },
                { name: 'BAS 104 - Statistics and Probabilities', credits: 3, marks: 40, icon: 'statistics', semester: 'fall' },
                { name: 'COM 102 - Fundamentals of Information Systems', credits: 3, marks: 60, icon: 'information', semester: 'fall' },
                { name: 'GEN 101 - English I', credits: 2, marks: 70, icon: 'english', semester: 'fall' },
                { name: 'GEN 103 - Social Issues and Anti-corruption', credits: 2, marks: 67, icon: 'social', semester: 'fall' },
                // Additional requested courses
                { name: 'Management', credits: 3, marks: '', icon: 'management', semester: 'fall' },
                { name: 'Ethics', credits: 2, marks: '', icon: 'ethics', semester: 'spring' },
                { name: 'Programming Language', credits: 3, marks: '', icon: 'programming', semester: 'spring' }
            ];
            
            this.courses = defaultCourses.map((course, index) => ({
                id: index + 1,
                ...course
            }));
        }
        this.renderCoursesTable();
    }
    
    filterSemester(semester) {
        this.currentSemester = semester;
        
        // Update button states
        document.getElementById('springBtn').classList.toggle('active', semester === 'spring');
        document.getElementById('fallBtn').classList.toggle('active', semester === 'fall');
        
        this.updateDisplay();
        this.saveData();
    }
    
    addCourse(courseName = '', credits = 3, marks = '') {
        const newCourse = {
            id: Date.now(), // Use timestamp as unique ID
            name: courseName || 'New Course',
            credits: credits,
            marks: marks,
            icon: 'default',
            semester: this.currentSemester === 'all' ? 'spring' : this.currentSemester
        };
        
        this.courses.push(newCourse);
        this.renderCoursesTable();
        this.calculateGPA();
        this.saveData();
    }
    
    removeCourse(courseId) {
        this.courses = this.courses.filter(course => course.id !== courseId);
        this.renderCoursesTable();
        this.calculateGPA();
        this.saveData();
    }
    
    updateCourse(courseId, field, value) {
        const course = this.courses.find(c => c.id === courseId);
        if (course) {
            if (field === 'credits') {
                course[field] = Math.max(1, Math.min(6, parseInt(value) || 1));
            } else if (field === 'marks') {
                const marks = parseFloat(value);
                course[field] = isNaN(marks) ? '' : Math.max(0, Math.min(100, marks));
            } else {
                course[field] = value;
            }
            
            this.calculateGPA();
            this.saveData();
        }
    }
    
    getGradeFromMarks(marks) {
        if (marks === '' || isNaN(marks)) return { grade: '--', points: 0 };
        
        const numMarks = parseFloat(marks);
        
        for (const [grade, data] of Object.entries(this.gradeScale)) {
            if (numMarks >= data.minMarks) {
                return { grade, points: data.points };
            }
        }
        
        return { grade: 'F', points: 0.0 };
    }
    
    getGradeBadgeClass(grade) {
        const gradeClass = grade.toLowerCase().replace('+', '-plus').replace('-', '-minus');
        return `grade-${gradeClass}`;
    }
    
    getCourseIcon(iconType) {
        return this.courseIcons[iconType] || this.courseIcons.default;
    }
    
    renderCoursesTable() {
        const tbody = document.getElementById('coursesTableBody');
        tbody.innerHTML = '';
        
        // Filter courses based on selected semester
        const filteredCourses = this.currentSemester === 'all' 
            ? this.courses 
            : this.courses.filter(course => course.semester === this.currentSemester);
        
        filteredCourses.forEach(course => {
            const gradeInfo = this.getGradeFromMarks(course.marks);
            const row = document.createElement('tr');
            row.className = 'fade-in';
            
            row.innerHTML = `
                <td class="text-center">
                    <div class="d-flex align-items-center justify-content-center">
                        <i class="${this.getCourseIcon(course.icon)} course-icon text-primary"></i>
                        <input type="text" class="form-control form-control-sm border-0 text-center fw-semibold" 
                               value="${course.name}" 
                               onchange="gpaCalculator.updateCourse(${course.id}, 'name', this.value)"
                               style="background: transparent; max-width: 200px;">
                    </div>
                </td>
                <td class="text-center">
                    <input type="number" class="form-control form-control-sm text-center" 
                           value="${course.credits}" 
                           min="1" max="6" 
                           onchange="gpaCalculator.updateCourse(${course.id}, 'credits', this.value)"
                           style="max-width: 80px; margin: 0 auto;">
                </td>
                <td class="text-center">
                    <input type="number" class="form-control form-control-sm text-center" 
                           value="${course.marks}" 
                           min="0" max="100" step="0.1"
                           placeholder="0-100"
                           onchange="gpaCalculator.updateCourse(${course.id}, 'marks', this.value)"
                           style="max-width: 90px; margin: 0 auto;">
                </td>
                <td class="text-center">
                    <span class="fw-bold ${gradeInfo.points > 0 ? 'text-success' : 'text-muted'}">
                        ${gradeInfo.points.toFixed(1)}
                    </span>
                </td>
                <td class="text-center">
                    <span class="grade-badge ${this.getGradeBadgeClass(gradeInfo.grade)}">
                        ${gradeInfo.grade}
                    </span>
                </td>
                <td class="text-center">
                    <button class="btn btn-remove btn-sm" 
                            onclick="gpaCalculator.removeCourse(${course.id})"
                            title="Remove Course">
                        <i class="fas fa-times"></i>
                    </button>
                </td>
            `;
            
            tbody.appendChild(row);
        });
    }
    
    calculateGPA() {
        let totalCredits = 0;
        let totalQualityPoints = 0;
        let coursesCompleted = 0;
        
        // Filter courses based on selected semester
        const filteredCourses = this.currentSemester === 'all' 
            ? this.courses 
            : this.courses.filter(course => course.semester === this.currentSemester);
        
        filteredCourses.forEach(course => {
            if (course.marks !== '' && !isNaN(course.marks)) {
                const gradeInfo = this.getGradeFromMarks(course.marks);
                const credits = parseInt(course.credits) || 0;
                
                totalCredits += credits;
                totalQualityPoints += gradeInfo.points * credits;
                coursesCompleted++;
            }
        });
        
        const gpa = totalCredits > 0 ? (totalQualityPoints / totalCredits) : 0;
        
        // Update display
        document.getElementById('semesterGPA').textContent = 
            totalCredits > 0 ? gpa.toFixed(2) : 'N/A';
        document.getElementById('totalCredits').textContent = totalCredits;
        document.getElementById('totalQualityPoints').textContent = totalQualityPoints.toFixed(1);
        document.getElementById('coursesCompleted').textContent = coursesCompleted;
        
        // Update GPA color based on value
        const gpaElement = document.getElementById('semesterGPA');
        gpaElement.className = 'text-primary fw-bold';
        if (gpa >= 3.5) {
            gpaElement.className = 'text-success fw-bold';
        } else if (gpa >= 2.5) {
            gpaElement.className = 'text-warning fw-bold';
        } else if (gpa > 0) {
            gpaElement.className = 'text-danger fw-bold';
        }
    }
    
    updateDisplay() {
        // Update year and semester display
        const yearNames = {
            'first': 'First Year',
            'second': 'Second Year',
            'third': 'Third Year',
            'fourth': 'Fourth Year',
            'fifth': 'Fifth Year'
        };
        
        const semesterNames = {
            'spring': 'Spring 2024',
            'fall': 'Fall 2024',
            'all': 'All Semesters'
        };
        
        document.getElementById('yearDisplay').textContent = yearNames[this.currentAcademicYear];
        document.getElementById('semesterDisplay').textContent = semesterNames[this.currentSemester];
        
        // Update dropdown values
        document.getElementById('academicYear').value = this.currentAcademicYear;
        
        // Update button states
        document.getElementById('springBtn').classList.toggle('active', this.currentSemester === 'spring');
        document.getElementById('fallBtn').classList.toggle('active', this.currentSemester === 'fall');
        
        this.renderCoursesTable();
        this.calculateGPA();
    }
    
    toggleDarkMode() {
        this.isDarkMode = !this.isDarkMode;
        const html = document.documentElement;
        
        if (this.isDarkMode) {
            html.setAttribute('data-bs-theme', 'dark');
            document.getElementById('toggleDarkMode').innerHTML = 
                '<i class="fas fa-sun me-2"></i>Toggle Light Mode';
        } else {
            html.setAttribute('data-bs-theme', 'light');
            document.getElementById('toggleDarkMode').innerHTML = 
                '<i class="fas fa-moon me-2"></i>Toggle Dark Mode';
        }
        
        this.saveData();
    }
    
    resetAllData() {
        if (confirm('Are you sure you want to reset all data? This action cannot be undone.')) {
            this.courses = [];
            this.currentAcademicYear = 'first';
            this.currentSemester = 'all';
            
            this.loadDefaultCourses();
            this.updateDisplay();
            this.saveData();
            
            // Show success message
            this.showNotification('All data has been reset successfully!', 'success');
        }
    }
    
    saveData() {
        const data = {
            courses: this.courses,
            currentAcademicYear: this.currentAcademicYear,
            currentSemester: this.currentSemester,
            isDarkMode: this.isDarkMode
        };
        
        localStorage.setItem('gpaCalculatorData', JSON.stringify(data));
    }
    
    loadSavedData() {
        const savedData = localStorage.getItem('gpaCalculatorData');
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                this.courses = data.courses || [];
                this.currentAcademicYear = data.currentAcademicYear || 'first';
                this.currentSemester = data.currentSemester || '1';
                this.isDarkMode = data.isDarkMode || false;
                
                // Apply dark mode if saved
                if (this.isDarkMode) {
                    document.documentElement.setAttribute('data-bs-theme', 'dark');
                    document.getElementById('toggleDarkMode').innerHTML = 
                        '<i class="fas fa-sun me-2"></i>Toggle Light Mode';
                }
            } catch (error) {
                console.error('Error loading saved data:', error);
            }
        }
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }
    
    // Export/Import functionality (bonus feature)
    exportData() {
        const data = {
            courses: this.courses,
            academicYear: this.currentAcademicYear,
            semester: this.currentSemester,
            exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `gpa_data_${this.currentAcademicYear}_sem${this.currentSemester}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
    
    importData(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (data.courses) {
                    this.courses = data.courses;
                    this.currentAcademicYear = data.academicYear || 'first';
                    this.currentSemester = data.semester || '1';
                    this.renderCoursesTable();
                    this.updateDisplay();
                    this.saveData();
                    this.showNotification('Data imported successfully!', 'success');
                }
            } catch (error) {
                this.showNotification('Error importing data. Please check the file format.', 'danger');
            }
        };
        reader.readAsText(file);
    }
}

// Initialize the GPA Calculator when the page loads
let gpaCalculator;

document.addEventListener('DOMContentLoaded', function() {
    gpaCalculator = new GPACalculator();
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl+R for reset (prevent default browser refresh)
        if (e.ctrlKey && e.key === 'r') {
            e.preventDefault();
            gpaCalculator.resetAllData();
        }
        
        // Ctrl+A for add course
        if (e.ctrlKey && e.key === 'a') {
            e.preventDefault();
            gpaCalculator.addCourse();
        }
        
        // Ctrl+D for dark mode toggle
        if (e.ctrlKey && e.key === 'd') {
            e.preventDefault();
            gpaCalculator.toggleDarkMode();
        }
    });
});

// Make functions globally available for onclick handlers
window.gpaCalculator = gpaCalculator;
