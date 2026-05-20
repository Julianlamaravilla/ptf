# Requirements Document: Scrum Master Project Assignment

## Introduction

Este documento especifica los requisitos funcionales y no funcionales para la asignación de uno o más proyectos a Scrum Masters en el sistema ERP de MacondoTek. La funcionalidad permite que Delivery Managers (Gerentes de Entrega) asignen proyectos a Scrum Masters desde la configuración del proyecto, proporcionando claridad sobre la gestión de proyectos, facilitando el acceso directo en el ERP y permitiendo delegar actualizaciones de estado sin que el Delivery Manager sea un cuello de botella. 

El feature integra con el sistema de roles y permisos ya implementado (ver diseño existente en `roles-and-permissions/design.md`) y extiende la funcionalidad de la entidad Project con la capacidad de asignar Scrum Masters individuales a cada proyecto.

**PREREQUISITO:** Los permisos `projects:write`, `projects:manage` y `users:read` deben estar definidos en HU-08 (Gestión de roles y permisos). Si estos no existen, la implementación de este feature debe ser bloqueada.

## Glossary

- **Delivery_Manager**: Rol en el sistema que gestiona múltiples proyectos y puede asignar Scrum Masters a ellos. Posee permisos `projects:write` y `projects:manage`.
- **Scrum_Master**: Rol en el sistema que gestiona proyectos individuales asignados. Posee permisos `projects:read`, `projects:write` (solo en proyectos asignados) y `milestones:read`, `milestones:write`.
- **Project**: Entidad central del ERP que representa un proyecto con su configuración, estado y equipo asociado.
- **Project Assignment**: La relación entre un Project y un Scrum_Master que indica que el Scrum Master gestiona ese proyecto.
- **ERP**: Enterprise Resource Planning system (sistema de gestión empresarial).
- **UI**: User Interface (interfaz de usuario).
- **API**: Application Programming Interface (interfaz de programación de aplicaciones).
- **Asignación**: Acción de vincular un Scrum Master específico a un proyecto.
- **Desasignación**: Acción de remover un Scrum Master previamente asignado a un proyecto.

## Requirements

### Requirement 1: Field for Scrum Master Assignment in Project Configuration

**User Story:** As a Delivery Manager, I want to have a field in the project configuration/edit screen, so that I can assign one Scrum Master to manage that project.

#### Acceptance Criteria

1. WHEN a Delivery Manager accesses the project configuration/edit form, THE Project_Configuration_UI SHALL display a field labeled "Assigned Scrum Master" or equivalent.
2. WHERE the project configuration form exists in both the frontend UI and backend API, THE Project_Configuration_UI SHALL render a dropdown/select field and THE Project_Configuration_API SHALL provide an endpoint to retrieve and save the Scrum Master assignment.
3. WHEN the form is displayed for a project that already has a Scrum Master assigned, THE Project_Configuration_UI SHALL pre-populate the field with the currently assigned Scrum Master's name.
4. IF the project currently has no Scrum Master assigned, THE Project_Configuration_UI SHALL display the field with a placeholder or empty state indicating "No assignment" or "Unassigned".
5. WHEN a Delivery Manager saves the project configuration form, THE Project_Configuration_API SHALL validate that the selected Scrum Master is a valid user with the Scrum_Master role before persisting the change.
6. IF the selected Scrum Master is invalid or no longer exists, THE Project_Configuration_API SHALL return a descriptive error message indicating that the selection is invalid.
7. WHEN the assignment is successfully saved, THE Project_Configuration_UI SHALL display a confirmation message to the Delivery Manager.

---

### Requirement 2: Populate Scrum Master List from System Users

**User Story:** As a Delivery Manager, I want the list of available Scrum Masters to be automatically populated from users with the Scrum Master role in the system, so that I don't need to manually manage a static list.

#### Acceptance Criteria

1. WHEN the project configuration form is loaded, THE Project_Configuration_API SHALL query the system database for all active users with the Scrum_Master role.
2. THE Project_Configuration_API SHALL return a list of users that includes at minimum: `user_id`, `full_name`, and `username` for each user with the Scrum_Master role.
3. IF there are no active Scrum Masters in the system, THE Project_Configuration_API SHALL return an empty list and THE Project_Configuration_UI SHALL display a message indicating "No Scrum Masters available in the system".
4. WHEN a Scrum Master user is disabled or has their role changed to a non-Scrum_Master role, THE Project_Configuration_API SHALL exclude that user from the available Scrum Masters list in the next API call.
5. WHILE the project configuration form is displayed, IF the list of available Scrum Masters changes in the system (a new user is created with Scrum_Master role), THE Project_Configuration_UI MAY display the updated list on the next page load or refresh.
6. THE Project_Configuration_API SHALL sort the list of available Scrum Masters alphabetically by full_name or username to improve usability.

---

### Requirement 3: One Scrum Master per Project

**User Story:** As a system administrator, I want to ensure that each project can have at most one Scrum Master assigned at any given time, so that accountability for project management is clear and unambiguous.

#### Acceptance Criteria

1. WHEN a Delivery Manager assigns a Scrum Master to a project that already has a different Scrum Master assigned, THE Project_Configuration_API SHALL replace the previous assignment with the new one (overwrite, not add).
2. THE Project database model SHALL enforce that the `scrum_master_id` foreign key column in the projects table contains at most one non-null value per project row.
3. IF a Delivery Manager attempts to assign the same Scrum Master who is already assigned to the project, THE Project_Configuration_API SHALL recognize this as a no-op (idempotent operation) and return success without modifying the database; the API SHALL return success even without no-op detection.
4. WHEN a project has a Scrum Master assigned, THE Project_Configuration_UI SHALL display a single name in the "Assigned Scrum Master" field, never multiple names.
5. THE Project database schema SHALL use a nullable foreign key constraint: `scrum_master_id INT NULLABLE REFERENCES users(id) ON DELETE SET NULL`.
6. IF a Scrum Master user account is deleted from the system, THE Project_Configuration_API SHALL execute ON DELETE SET NULL behavior, removing the reference but preserving the project record; additionally, THE Project_Configuration_API SHALL include application-level checks to ensure project preservation even if the database constraint fails to execute properly.

---

### Requirement 4: Multiple Projects per Scrum Master

**User Story:** As a Scrum Master, I want to be able to have multiple projects assigned to me, so that I can manage all my responsibilities from a single role.

#### Acceptance Criteria

1. WHEN a Delivery Manager assigns multiple projects to the same Scrum Master, THE Project_Configuration_API SHALL accept and persist all assignments without conflict or limitation on the number of projects.
2. WHEN a Scrum Master views their assigned projects in the system (e.g., via a dashboard or projects list), THE Scrum_Master_Project_List SHALL display all projects where the user is assigned as the Scrum Master.
3. WHEN a Scrum Master is unassigned from one project, THE Project_Configuration_API SHALL NOT affect the assignments of other projects where the same Scrum Master is assigned.
4. THE database schema SHALL NOT impose any explicit limit (via CHECK constraint or trigger) on the number of projects a Scrum Master can manage; there SHALL be no limit on how many projects one person can manage.
5. THE Scrum_Master_Project_List API endpoint SHALL return a paginated or complete list of all projects assigned to the authenticated Scrum Master, including project name, ID, status, and client information.
6. WHEN a Delivery Manager removes a Scrum Master assignment from a project by setting it to null or selecting "No assignment", THE Project_Configuration_API SHALL accept this change and the project SHALL be visible in general project lists but NOT in the Scrum Master's personal project list.

---

### Requirement 5: Visibility of Assignment in Project Detail and List

**User Story:** As a Delivery Manager or Scrum Master, I want to see the assigned Scrum Master in the project detail view and in the project list, so that I have clear visibility of who is managing each project.

#### Acceptance Criteria

1. WHEN a Delivery Manager or Scrum Master views the project detail page, THE Project_Detail_View SHALL display the assigned Scrum Master's full name and/or username in a clearly labeled field (e.g., "Managed by", "Scrum Master"); the system SHALL guarantee this display always works and that assigned Scrum Masters are always visible when data exists.
2. WHEN viewing a project detail page where no Scrum Master is assigned, THE Project_Detail_View SHALL display an empty state or placeholder message (e.g., "Unassigned", "No Scrum Master assigned").
3. WHEN viewing the project list (general projects list accessible to Delivery Managers), THE Project_List_View SHALL include a column or visible indicator showing the assigned Scrum Master for each project; this column SHALL be visible even when all projects are unassigned.
4. IF the Scrum Master name is too long to display in the project list, THE Project_List_View SHALL truncate it with an ellipsis (...) and provide a tooltip on hover that displays the full name and username.
5. THE Project_List_API response SHALL include the Scrum Master assignment information (user_id and full_name at minimum) for each project returned.
6. WHEN a user with read permissions on projects queries the project list endpoint, THE Project_List_API SHALL include the Scrum Master assignment data without requiring a separate API call, to minimize network requests.
7. WHERE the project configuration is modified and the Scrum Master assignment changes, THE Project_Detail_View and Project_List_View SHALL reflect the updated assignment within 5 seconds of the modification (either automatically via polling, WebSocket, or on next manual refresh).

---

### Requirement 6: Role-Based Access Control for Assignment

**User Story:** As a system administrator, I want to ensure that only Delivery Managers can assign or modify Scrum Master assignments, so that project governance remains under appropriate authorization.

#### Acceptance Criteria

1. WHEN a user with the Delivery_Manager role attempts to access the project configuration form and modify the Scrum Master assignment, THE Project_Configuration_API SHALL grant access and allow the modification if the user has the `projects:write` or `projects:manage` permission; the Delivery Manager role alone is sufficient - no additional permission checks are needed.
2. IF a user without the Delivery_Manager role (e.g., Scrum_Master, Financiero) attempts to modify the Scrum Master assignment, THE Project_Configuration_API SHALL return HTTP 403 Forbidden and display an error message: "You do not have permission to modify project assignments"; role restrictions take precedence - Scrum Masters are always forbidden from modifying assignments regardless of individual permission levels.
3. WHERE a Scrum Master views their assigned projects, THE Scrum_Master_Project_List view SHALL be read-only for the Scrum Master; they SHALL be able to view but NOT modify the assignment.
4. WHEN a Scrum Master with `projects:write` permission attempts to assign themselves to a project they are not already managing, THE Project_Configuration_API SHALL reject the request with HTTP 403 Forbidden (Scrum Masters cannot self-assign).
5. WHEN a Scrum Master attempts to unassign themselves or another Scrum Master from a project, THE Project_Configuration_API SHALL reject the request with HTTP 403 Forbidden; only Delivery Managers can change assignments.
6. THE Project_Configuration_API endpoint for modifying Scrum Master assignments SHALL require permission checks before any processing - THE endpoint SHALL check permissions before processing any request and return HTTP 403 immediately if user lacks `projects:write` or `projects:manage`; the Delivery Manager role alone is sufficient authorization for this endpoint.

---

### Requirement 7: Data Persistence and Database Schema

**User Story:** As a data architect, I want the Scrum Master assignment to be persisted in the database with proper constraints and relationships, so that data integrity is maintained and queries are efficient.

#### Acceptance Criteria

1. THE projects table in the database SHALL contain a new column: `scrum_master_id INT NULLABLE UNIQUE=FALSE`.
2. THE projects table SHALL define a foreign key constraint: `FOREIGN KEY (scrum_master_id) REFERENCES users(id) ON DELETE SET NULL`.
3. THE projects table SHALL create an index on the `scrum_master_id` column to optimize queries filtering or sorting by Scrum Master assignment.
4. WHEN the database migration is executed, THE migration script SHALL create the new column and index in a single, atomic operation using `ALTER TABLE` or an equivalent database-specific command.
5. IF the projects table already has a `scrum_master_id` column, THE migration script SHALL verify its presence and skip creation to prevent duplicate column errors.
6. THE Project database schema SHALL NOT create a UNIQUE constraint on `scrum_master_id` (i.e., multiple projects can be assigned to the same Scrum Master); there SHALL be no limit on how many projects one person can manage.
7. WHEN a project record is inserted or updated, THE database engine SHALL enforce that `scrum_master_id` references a valid user ID or is NULL; invalid references SHALL be rejected.
8. THE SQLAlchemy ORM model for Project SHALL include a relationship property `scrum_master: User` with appropriate cascade delete semantics.

---

### Requirement 8: API Endpoint for Retrieving Available Scrum Masters

**User Story:** As a frontend developer, I want a dedicated API endpoint to retrieve the list of available Scrum Masters, so that I can populate the dropdown in the project configuration form without hardcoding the data.

#### Acceptance Criteria

1. THE API SHALL expose a GET endpoint at `/api/v1/scrum-masters` or `/api/v1/users?role=Scrum_Master` that returns a list of active Scrum Masters.
2. THE endpoint SHALL require the requesting user to have at least `users:read` permission; users without this permission SHALL receive HTTP 403 Forbidden.
3. THE endpoint response SHALL return a JSON object with the following structure:
   ```json
   {
     "total": 5,
     "items": [
       { "id": 1, "username": "scrum_user_1", "full_name": "John Doe" },
       { "id": 2, "username": "scrum_user_2", "full_name": "Jane Smith" }
     ]
   }
   ```
4. THE endpoint SHALL return only users with the `Scrum_Master` role and `is_active=TRUE`.
5. THE endpoint SHALL support optional query parameters for pagination: `?skip=0&limit=10` to retrieve a subset of results.
6. IF no Scrum Masters are found, THE endpoint SHALL return HTTP 403 for permission failures even when no Scrum Masters exist; if permission is granted and no results match, THE endpoint SHALL return HTTP 200 with an empty `items` list: `{ "total": 0, "items": [] }`.
7. THE endpoint response data SHALL be sorted alphabetically by `full_name` or `username` to ensure consistent ordering.
8. THE endpoint response SHALL include only the fields necessary for frontend display and assignment (id, username, full_name); sensitive fields like hashed passwords SHALL NOT be included.

---

### Requirement 9: API Endpoint for Retrieving Project with Scrum Master Assignment

**User Story:** As a frontend developer, I want the existing GET project detail endpoint to include Scrum Master assignment information, so that I can display the Scrum Master's name on the project detail page without making an additional API call.

#### Acceptance Criteria

1. WHEN the frontend requests the project detail endpoint (GET `/api/v1/projects/{project_id}`), THE endpoint response SHALL include a new field `scrum_master` with nested user information (id, username, full_name).
2. IF the project has no Scrum Master assigned, THE `scrum_master` field SHALL be `null` in the response.
3. WHEN a user without `projects:read` permission requests the project detail endpoint, THE API SHALL return HTTP 403 Forbidden and SHALL NOT return any project data including the Scrum Master assignment.
4. THE endpoint response structure SHALL follow existing API patterns in the project (e.g., nested objects, camelCase or snake_case consistency).
5. THE endpoint SHALL use a single database query (with JOIN) to retrieve the project and Scrum Master information together, avoiding the N+1 query problem.

---

### Requirement 10: API Endpoint for Updating Scrum Master Assignment

**User Story:** As a frontend developer, I want a dedicated API endpoint to update the Scrum Master assignment for a project, so that I can implement the assignment functionality in the project configuration form.

#### Acceptance Criteria

1. THE API SHALL expose a PUT or PATCH endpoint at `/api/v1/projects/{project_id}/scrum-master` that allows a Delivery Manager to assign or unassign a Scrum Master.
2. THE endpoint SHALL accept a JSON request body with the following structure:
   ```json
   { "scrum_master_id": 5 }
   ```
   or
   ```json
   { "scrum_master_id": null }
   ```
   to unassign.
3. THE endpoint SHALL require the requesting user to have the permission `projects:write` or `projects:manage`.
4. IF the requesting user does NOT have the required permission, THE endpoint SHALL return HTTP 403 Forbidden with message: "Permission denied: projects:write or projects:manage required".
5. IF the provided `project_id` does not exist, THE endpoint SHALL return HTTP 404 Not Found.
6. IF the provided `scrum_master_id` is not null and does not correspond to an active user with the Scrum_Master role, THE endpoint SHALL return HTTP 400 Bad Request with message: "Invalid Scrum Master: user does not exist or does not have Scrum_Master role".
6.5. IF the request body contains a non-integer or negative value for scrum_master_id, THE endpoint SHALL return HTTP 400 Bad Request with message "Invalid data type: scrum_master_id must be a positive integer or null".
7. WHEN the assignment is successful, THE endpoint SHALL return HTTP 200 OK with the updated project object including the new `scrum_master` field.
8. IF the endpoint is called with `scrum_master_id=null` (unassign) and the project has no Scrum Master assigned, THE endpoint SHALL treat this as idempotent (no-op) and return HTTP 200 with the current project state.
9. THE endpoint SHALL log the change (actor_user_id, action, project_id, new_scrum_master_id, timestamp) to the application audit log in the format defined in the roles-and-permissions design document.
10. WHEN the Scrum Master assignment is updated, THE endpoint response SHALL include a `message` field confirming the change: e.g., "Scrum Master assignment updated successfully".

---

### Requirement 11: UI Component for Scrum Master Assignment Selection

**User Story:** As a frontend developer, I want a reusable UI component for selecting a Scrum Master in dropdown/select format, so that I can use it consistently across the project configuration form and other relevant screens.

#### Acceptance Criteria

1. THE component SHALL be a dropdown/select field that displays the list of available Scrum Masters retrieved from the API endpoint (`/api/v1/scrum-masters`).
2. THE component SHALL render using Material-UI (MUI) v9 or Ant Design v6 based on existing project dependencies.
3. THE component SHALL support the following props: `value` (current assignment), `onChange` (callback when selection changes), `disabled` (to disable the field), `error` (to display validation errors), `required` (to mark as required).
4. THE component SHALL display Scrum Masters sorted alphabetically by full name.
5. THE component SHALL include a "None" or "Unassigned" option that allows clearing the current assignment by setting the value to `null`.
6. IF the list of available Scrum Masters is empty, THE component SHALL display a disabled state with message: "No Scrum Masters available".
7. THE component SHALL handle loading states (while fetching the list of Scrum Masters) by displaying a loading spinner or skeleton.
8. IF the API call to retrieve Scrum Masters fails, THE component SHALL show cached Scrum Masters with error indication if previously loaded data exists; otherwise, THE component SHALL display an error state with message "Failed to load Scrum Masters" and provide a retry button.

---

### Requirement 12: Scrum Master Personal Project Dashboard

**User Story:** As a Scrum Master, I want to see a list of all projects assigned to me in a dedicated section or dashboard, so that I can quickly access the projects I manage without navigating through the full project list.

#### Acceptance Criteria

1. WHEN a Scrum Master logs into the system, THE dashboard or home screen SHALL display a section titled "My Projects" or "Assigned Projects" that shows only projects assigned to that Scrum Master.
2. THE "My Projects" section SHALL list each assigned project with the following information: project name, client/company name, project status, start date, and end date (if applicable).
3. WHEN the Scrum Master views their projects list, THE Projects_API SHALL return only projects where `scrum_master_id = current_user.id`.
4. THE "My Projects" list SHALL support sorting by project name, status, or start date.
5. WHEN the Scrum Master clicks on a project in the "My Projects" list, THE system SHALL navigate to the project detail page with all project information visible to the Scrum Master.
6. IF a Scrum Master has no projects assigned, THE "My Projects" section SHALL display a message: "You have no projects assigned. Contact your Delivery Manager for project assignment".
7. WHEN a new project is assigned to a Scrum Master via the assignment API, THE "My Projects" list SHALL update on the Scrum Master's next page load; real-time updates are optional and MAY use polling (every 5s) or WebSocket when implemented.
8. WHERE pagination is implemented, THE "My Projects" list SHALL support pagination with configurable page size (e.g., 10, 20, 50 items per page).

---

### Requirement 13: Audit and Change Tracking

**User Story:** As a system administrator, I want to track all Scrum Master assignment changes for audit purposes, so that I can review the history of project assignments and identify who made changes and when.

#### Acceptance Criteria

1. WHENEVER a Scrum Master is assigned to a project, THE system SHALL create an audit log entry with the following information: timestamp, actor_user_id (the Delivery Manager who made the change), action ("scrum_master_assigned"), project_id, new_scrum_master_id, and previous_scrum_master_id (null if no prior assignment).
2. WHENEVER a Scrum Master is unassigned from a project (set to null), THE system SHALL create an audit log entry with action ("scrum_master_unassigned"), project_id, and previous_scrum_master_id.
3. THE audit log SHALL be stored in the application log file (`logs/app.log`) using structured logging (JSON format) as defined in the roles-and-permissions design document.
4. THE audit log SHALL be queryable or exportable for administrative review (e.g., via a dedicated audit report endpoint or by analyzing the application logs); WHEN an administrator queries audit logs for Scrum Master assignments, THE system SHALL require permission `audit:read` to access the logs; only Administrators can view audit history.
5. IF an error occurs during the assignment update, THE system SHALL log the error and include the error message and stack trace in the audit log for debugging purposes.
6. THE audit log entries SHALL NOT include sensitive user data like passwords or authentication tokens.

---

### Requirement 14: Accessibility - Dropdown Component

**User Story:** As a user with visual impairments or using assistive technology, I want the Scrum Master dropdown component to be fully accessible, so that I can navigate and interact with it using keyboard and screen readers.

#### Acceptance Criteria

1. THE Scrum Master dropdown component SHALL have ARIA labels (`aria-label`) and descriptions (`aria-describedby`) for screen readers that clearly identify the field's purpose.
2. THE component SHALL be fully navigable via keyboard: Arrow Up/Down to move between options, Enter/Space to select, Escape to close, Tab to move to next field.
3. THE component SHALL announce "No Scrum Masters available" state to assistive technology when the list is empty.
4. THE component SHALL use semantic HTML (e.g., `<select>` or ARIA-compliant custom dropdown patterns) to ensure compatibility with screen readers.
5. THE component's loading and error states SHALL be announced to assistive technology (e.g., "Loading Scrum Masters" or "Error loading Scrum Masters").

---

### Requirement 15: Automatic Unassignment on Role Change

**User Story:** As a system administrator, I want unassigned Scrum Masters to be automatically removed from their projects when their role changes, so that project governance remains accurate and prevents inactive Scrum Masters from retaining project assignments.

#### Acceptance Criteria

1. WHEN a Scrum Master user's role is changed to a different role (e.g., from Scrum_Master to Financiero or a custom role), THE system SHALL automatically unassign them from all projects where they are the assigned Scrum Master.
2. WHEN the automatic unassignment occurs, THE system SHALL set `scrum_master_id = null` for all affected projects in a single, atomic database operation.
3. THE system SHALL log this automatic unassignment as an audit event with action "scrum_master_role_change_unassign", including: timestamp, previous_role, new_role, actor_user_id (the admin who changed the role), and a list of project_ids that were unassigned.
4. IF a role change operation occurs but no projects are assigned to the user, THE system SHALL still create an audit log entry indicating the role change, even if no projects were affected.
5. THE audit log entry for role-based unassignment SHALL be distinguishable from manual unassignments (different action type) to enable audit trail clarity.

---

## Acceptance Criteria Mapping to Properties

The following acceptance criteria are testable as **property-based tests**:

- **Requirement 3, AC 3**: Idempotence of assignment — assigning the same Scrum Master twice returns the same result.
- **Requirement 3, AC 5-6**: Foreign key constraint enforcement — invalid scrum_master_id references are rejected; ON DELETE SET NULL is enforced.
- **Requirement 4, AC 1 & 4**: No limit on projects per Scrum Master — multiple projects can reference the same Scrum Master.
- **Requirement 7, AC 1-3**: Schema correctness — column exists, foreign key exists, index exists.
- **Requirement 8, AC 4 & 7**: API response consistency — only active Scrum Masters returned, sorted consistently.
- **Requirement 10, AC 6 & 8**: Validation of Scrum Master existence and idempotence — null assignments are idempotent.
- **Requirement 10, AC 6.5**: Type validation — non-integer or negative scrum_master_id values are rejected with appropriate error.
- **Requirement 12, AC 3**: Query filtering — only projects with scrum_master_id = user.id are returned for a Scrum Master.
- **Requirement 14, AC 2**: Keyboard navigation — all keyboard interactions work as specified (Arrow, Enter, Escape, Tab).
- **Requirement 15, AC 1-2**: Automatic unassignment on role change — when a Scrum Master role is removed, all projects are automatically unassigned atomically.

## Integration with Existing Systems

### Roles and Permissions

This feature integrates with the existing **roles-and-permissions** system:

- **Delivery_Manager** role requires permissions: `projects:read`, `projects:write`, `projects:manage`
- **Scrum_Master** role requires permissions: `projects:read`, `projects:write` (limited to assigned projects), `milestones:read`, `milestones:write`
- The assignment endpoint uses the existing `require_permission` decorator to enforce authorization.

### Project Entity

The feature extends the existing **Project** entity:

- Adds `scrum_master_id` column (nullable foreign key to users table)
- Adds SQLAlchemy relationship `scrum_master: User`
- Updates existing endpoints (GET /projects, GET /projects/{id}) to include Scrum Master data

### User Entity

No changes to the User entity; it already has a `role_id` field that determines if a user is a Scrum Master.

### Frontend State Management

Integrates with existing React Context for:
- Authentication (MSAL/AuthContext)
- Permissions (PermissionsContext from roles-and-permissions feature)
- Project state management (if Redux or Context exists)

