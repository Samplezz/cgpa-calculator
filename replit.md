# CS CALC - Computer Science GPA Calculator

## Overview

This is a Flask-based web application designed to calculate GPA (Grade Point Average) for Computer Science students. The application provides a user-friendly interface for students to input their courses, grades, and credit hours to calculate their semester and cumulative GPA across different academic years. The calculator is pre-loaded with actual course data from the user's university transcript.

## System Architecture

### Frontend Architecture
- **Framework**: Pure HTML5, CSS3, and JavaScript (ES6+)
- **UI Framework**: Bootstrap 5 for responsive design and components
- **Icons**: Font Awesome 6 for iconography
- **Theme Support**: Built-in dark/light mode switching
- **Responsive Design**: Mobile-first approach with Bootstrap grid system

### Backend Architecture
- **Framework**: Flask (Python web framework)
- **Application Structure**: Simple single-module Flask app
- **Session Management**: Flask sessions with configurable secret key
- **Logging**: Python logging module for debugging
- **Environment Configuration**: Environment variables for sensitive data

### Data Storage
- **Client-side Storage**: Local storage for persisting user data
- **No Database**: Currently uses browser local storage for data persistence
- **Session Data**: Flask sessions for temporary server-side data

## Key Components

### 1. Flask Application (`app.py`)
- Main Flask application with single route
- Configurable session secret key from environment variables
- Debug logging enabled for development
- Serves the main calculator interface

### 2. Frontend Calculator (`calculator.js`)
- **GPACalculator Class**: Main application logic
- **Grade Scale System**: Standard 4.0 GPA scale with letter grades
- **Course Management**: Add, edit, delete courses with credit hours
- **Multi-semester Support**: Handles different academic years and semesters
- **Theme Management**: Dark/light mode toggle functionality

### 3. User Interface (`index.html`)
- Academic year selection (First through Fifth year)
- Semester selection (Semester 1 and 2)
- Course input forms with grade and credit hour fields
- Real-time GPA calculation display
- Responsive design for mobile and desktop

### 4. Styling (`style.css`)
- Custom CSS variables for theming
- Gradient backgrounds for visual appeal
- Dark mode support with CSS custom properties
- Card-based layout with blur effects
- Responsive breakpoints for different screen sizes

## Data Flow

1. **User Input**: Students select academic year and semester
2. **Course Entry**: Users add courses with names, credit hours, and grades
3. **Grade Calculation**: JavaScript calculates GPA using 4.0 scale
4. **Local Storage**: Data persists in browser's local storage
5. **Display Updates**: Real-time GPA updates as users modify courses

## External Dependencies

### CDN Dependencies
- **Bootstrap 5.3.0**: UI framework and components
- **Font Awesome 6.4.0**: Icon library for enhanced UX

### Python Dependencies
- **Flask**: Web framework for serving the application
- **Standard Library**: os, logging modules

## Deployment Strategy

### Development Environment
- **Host**: 0.0.0.0 (accessible from all network interfaces)
- **Port**: 5000 (standard Flask development port)
- **Debug Mode**: Enabled for development with hot reload

### Production Considerations
- Environment variable configuration for session secrets
- WSGI server deployment recommended (Gunicorn, uWSGI)
- Static file serving through web server (nginx, Apache)

### Current Limitations
- No persistent server-side data storage
- No user authentication system
- No data backup/export functionality

## User Preferences

Preferred communication style: Simple, everyday language.

## Changelog

Changelog:
- July 03, 2025. Initial setup