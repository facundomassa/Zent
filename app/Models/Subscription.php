<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subscription extends Model
{
    use HasFactory;

    protected $fillable = ['team_id', 'stripe_subscription_id', 'status', 'ends_at'];

    public function team() {
        return $this->belongsTo(Team::class);
    }
}
