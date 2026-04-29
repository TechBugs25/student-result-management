<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Exam extends Model
{
    use HasUuids;

    protected $fillable = ['name', 'academic_year', 'start_date', 'end_date'];

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
        ];
    }

    public function results()
    {
        return $this->hasMany(Result::class);
    }
}
