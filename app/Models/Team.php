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

    public function subscription() {
        return $this->hasOne(Subscription::class);
    }
}
