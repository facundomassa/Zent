<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Team extends Model
{
    use HasFactory;
    
    protected $fillable = ['name', 'user_id', 'stripe_id'];

    public function users() {
        return $this->hasMany(User::class);
    }

    public function projects() {
        return $this->hasMany(Project::class);
    }

    public function getMembersCountAttribute()
    {
        return $this->members()->count();
    }

    public function getProjectsCountAttribute()
    {
        return $this->projects()->count();
    }

    public function subscription() {
        return $this->hasOne(Subscription::class);
    }

    public function invitations()
    {
        return $this->hasMany(TeamInvitation::class);
    }

    public function isAdmin(User $user)
    {
        return $this->owner_id === $user->id;
    }

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function members()
    {
        return $this->belongsToMany(User::class)
            ->withPivot('role')
            ->withTimestamps();
    }
}
