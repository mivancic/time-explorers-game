# Time Explorers Game - Component Architecture

## Overview

This document outlines the component architecture for the Time Explorers Game application. The architecture follows a modular approach with clear separation of concerns between screens, components, hooks, services, and utilities.

## Application Structure

```
App
├── Screens (StateFul Container Components)
│   ├── CharacterSelectScreen
│   ├── NameInputScreen
│   ├── StartScreen
│   ├── GameScreen
│   ├── SuccessScreen
│   ├── GameOverScreen
│   ├── ConfigScreen
│   └── ScoreboardScreen
├── Components (Reusable UI Elements)
│   ├── AnalogueClock
│   ├── ClockAnimation
│   ├── Question
│   ├── Timer
│   ├── AnswerGrid
│   ├── Feedback
│   └── Button
└── State Management (Hooks & Context)
    ├── useGameState
    ├── useQuestions
    ├── useStorage
    └── useAudio
```

## Component Hierarchy

The diagram below illustrates the component hierarchy and data flow:

```
                                 +------------+
                                 |    App     |
                                 +-----+------+
                                       |
                +--------------------+-+-------------------+
                |                    |                     |
        +-------v-------+   +--------v--------+   +-------v-------+
        |    Screens    |   |   Components    |   |     Hooks     |
        +-------+-------+   +--------+--------+   +-------+-------+
                |                    |                     |
     +----------+----------+         |           +--------+--------+
     |          |          |         |           |        |        |
+----v---+ +----v---+ +----v----+    |     +----v----+ +-v------+ +--v-----+
|Character| |  Name  | |  Game   |    |     |   Game  | |Question| | Audio  |
| Select  | | Input  | | Screen  |    |     |  State  | | State  | |Service |
+----+----+ +----+---+ +----+----+    |     +----+----+ +--------+ +--------+
     |          |          |          |          |
     |          |          |     +----v----+     |
     |          |          |     |Analogue |     |
     |          |          |     |  Clock  |     |
     |          |          |     +---------+     |
     |          |          |                     |
     +----------+----------+---------------------+
                |
         +------v-------+
         | Data Services|
         +------+-------+
                |
        +-------+--------+
        |       |        |
    +---v---+ +-v----+ +-v------+
    |Storage| |Config| |Questions|
    +-------+ +------+ +---------+
```

## Data Flow

1. **App Component**: The root component that manages routing between screens based on game state
2. **Screens**: Container components that represent different views in the application
3. **Components**: Reusable UI elements used by screens
4. **Hooks**: Custom hooks that manage state and business logic
5. **Services**: Handle external interactions like audio and storage

## Key Components and Responsibilities

### Screens

- **CharacterSelectScreen**: Allows player to choose a character
- **NameInputScreen**: Allows player to enter their name
- **StartScreen**: Displays main menu options (new game, continue, settings)
- **GameScreen**: Primary gameplay screen with questions, answers, and clock
- **SuccessScreen**: Displays when player successfully completes the game
- **GameOverScreen**: Displays when player fails to complete the game
- **ConfigScreen**: Allows player to modify game settings
- **ScoreboardScreen**: Displays player scores and statistics

### Components

- **AnalogueClock**: Renders an analogue clock face with hands at specified time
- **ClockAnimation**: Manages animation between two clock states
- **Question**: Displays the current question with formatting
- **Timer**: Visual countdown timer with progress indication
- **AnswerGrid**: Two-column grid of selectable answer options
- **Feedback**: Visual and textual feedback on answer correctness
- **Button**: Styled button component with consistent appearance

### Hooks

- **useGameState**: Central game state management including scoring and progression
- **useQuestions**: Manages question loading, selection, and verification
- **useStorage**: Handles saving and loading game state
- **useAudio**: Controls sound effects and background audio

### Services

- **audioService**: Handles loading and playing sound effects
- **storageService**: Manages data persistence using localStorage
- **questionService**: Provides question data and answer validation

## State Management

The application uses React's Context API and custom hooks for state management:

- **GameContext**: Provides game state to all components
- **ConfigContext**: Manages application configuration
- **AudioContext**: Controls audio playback settings

## Styling Approach

- **Tailwind CSS**: Used for consistent styling throughout the application
- **Component-specific CSS**: For complex animations and layouts
- **Responsive Design**: Adapts to different screen sizes and orientations

## Future Enhancements

- **Internationalization**: Support for multiple languages
- **Theme Switching**: Light and dark mode support
- **Advanced Analytics**: Detailed performance tracking
- **Offline Support**: Full functionality without internet connection
