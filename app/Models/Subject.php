<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    use HasUuids;

    protected $fillable = ['code', 'name', 'type'];

    public function results()
    {
        return $this->hasMany(Result::class);
    }
}
