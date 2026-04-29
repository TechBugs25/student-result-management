<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class GradingScale extends Model
{
    use HasUuids;

    protected $fillable = [
        'letter_grade', 'gpa_point', 'min_percentage', 'max_percentage', 'description'
    ];
}
