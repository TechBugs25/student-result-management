# Database Management System (DBMS) Plan 1.0

This plan outlines the core database schema and relationships required for the Student Result Management backend.

## Proposed Changes

We will create the following database tables and Eloquent models.

### 1. `users` (Existing)
Handles authentication for Administrators, Teachers, and Students.
- **[MODIFY]** `User` model and migration
  - `id` (string, UUID, primary key)
  - `name` (string)
  - `email` (string, unique)
  - `email_verified_at` (timestamp, nullable)
  - `password` (string)
  - `role` (enum: admin, teacher, student)
  - `remember_token` (string, nullable)
  - `created_at` (timestamp)
  - `updated_at` (timestamp)

---

### 2. `academic_classes`
Represents a grade level or specific group (e.g., "Grade 10").
- **[NEW]** `AcademicClass` model and migration
  - `id` (string, UUID, primary key)
  - `name` (string) - e.g., "Grade 10"
  - `section` (string, nullable) - e.g., "A"
  - `created_at` (timestamp)
  - `updated_at` (timestamp)

---

### 3. `students`
Stores personal and academic profiles of the students.
- **[NEW]** `Student` model and migration
  - `id` (string, UUID, primary key)
  - `user_id` (string, foreign key -> `users.id`, nullable)
  - `academic_class_id` (string, foreign key -> `academic_classes.id`)
  - `admission_number` (string, unique)
  - `first_name` (string)
  - `last_name` (string)
  - `date_of_birth` (date)
  - `gender` (enum: male, female)
  - `created_at` (timestamp)
  - `updated_at` (timestamp)

---

### 4. `subjects`
Stores the subjects taught in the institution.
- **[NEW]** `Subject` model and migration
  - `id` (string, UUID, primary key)
  - `code` (string, unique) - e.g., "MATH101"
  - `name` (string) - e.g., "Mathematics"
  - `type` (enum: mandatory, optional)
  - `created_at` (timestamp)
  - `updated_at` (timestamp)

---

### 5. `grading_scales`
Defines the rules for calculating Letter Grades and GPA. This allows admins to configure grading rules dynamically without changing code.
- **[NEW]** `GradingScale` model and migration
  - `id` (string, UUID, primary key)
  - `letter_grade` (string) - e.g., "A+"
  - `gpa_point` (decimal, 8, 2) - e.g., 4.00
  - `min_percentage` (decimal, 8, 2) - e.g., 80.00
  - `max_percentage` (decimal, 8, 2) - e.g., 100.00
  - `description` (string, nullable) - e.g., "Excellent"
  - `created_at` (timestamp)
  - `updated_at` (timestamp)

---

### 6. `exams`
Represents a specific examination event.
- **[NEW]** `Exam` model and migration
  - `id` (string, UUID, primary key)
  - `name` (string) - e.g., "Mid-Term Examination"
  - `academic_year` (string) - e.g., "2026-2027"
  - `start_date` (date)
  - `end_date` (date)
  - `created_at` (timestamp)
  - `updated_at` (timestamp)

---

### 7. `results`
The core table storing individual student marks for a subject in a specific exam.
- **[NEW]** `Result` model and migration
  - `id` (string, UUID, primary key)
  - `student_id` (string, foreign key -> `students.id`)
  - `exam_id` (string, foreign key -> `exams.id`)
  - `subject_id` (string, foreign key -> `subjects.id`)
  - `marks_obtained` (decimal)
  - `total_marks` (decimal)
  - `letter_grade` (string) - e.g., "A+" (Auto-calculated via grading_scales)
  - `gpa_point` (decimal, 8, 2) - e.g., 4.00 (Auto-calculated via grading_scales)
  - `remarks` (text, nullable)
  - `created_at` (timestamp)
  - `updated_at` (timestamp)

*(We will add a unique compound index on `student_id`, `exam_id`, and `subject_id` to prevent duplicate result entries).*
