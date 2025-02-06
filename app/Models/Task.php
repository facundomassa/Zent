<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'due_date',
        'status',
        'order',
        'project_id',
    ];

    protected $appends = ['comments_count'];

    public function getCommentsCountAttribute() {
        return $this->comments()->count();
    }

    public function project() {
        return $this->belongsTo(Project::class);
    }

    public function users() {
        return $this->belongsToMany(User::class)->withTimestamps();
    }

    public function comments() {
        return $this->hasMany(Comment::class);
    }
}
