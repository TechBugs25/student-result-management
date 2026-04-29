<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class AcademicClass extends Model
{
    use HasUuids;

    protected $fillable = ['name', 'section'];

    public function students()
    {
        return $this->hasMany(Student::class);
    }
}
