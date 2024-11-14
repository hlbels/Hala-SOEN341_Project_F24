## Date: November 9, 2024

### Attendees:
- Hala Belamri (self-meeting)

### Agenda:
1. Sprint 3 progress review
2. Decision on feature focus and adjustments for Sprint 4

### Discussion:
- **Feature Implementation**:
  - **Dimensional Assessment**: Implemented a four-dimensional assessment feature.
  - **Results Display**:
    - Enabled access to display results.
    - Added options to download results as CSV or PDF.
    - Decided to postpone the feature for instructors to modify questions and dimensions to Sprint 4 due to time constraints.
  - **CSS Overhaul**: Updated the styling for a more refined look.
  - **Student Team Features**:
    - Created logic to recognize signed-in users and their associated teams.
    - Implemented a new feature allowing students to:
      - Request to leave their current team.
      - Request to join a different team, with requests visible to the instructor.
    - Updated assessment logic so students no longer need to manually enter their name or select a team; their group and email are automatically recognized.
  - **Contact Us Page**: Added a message box to enable users to send messages.
  - **LinkedIn Link**: Added a LinkedIn link on the Contact Us page.

- **Testing and Pipeline Adjustments**:
  - Adjusted and implemented two new tests to accommodate recent changes.
  - Fixed existing tests due to modifications in logic.
  - Updated CI pipeline to reflect file structure changes and ensured successful runs.

### Action Items:
- Focus on adding more tests and further CSS styling adjustments.
- Prioritize feature refinements and testing for the remainder of Sprint 3.
