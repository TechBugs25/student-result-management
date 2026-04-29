<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Result extends Model
{
    use HasUuids;

    protected $fillable = [
        'student_id', 'exam_id', 'subject_id', 'marks_obtained', 
        'total_marks', 'letter_grade', 'gpa_point', 'remarks'
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function exam()
    {
        return $this->belongsTo(Exam::class);
    }

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }
}
