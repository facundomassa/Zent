<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;

class NewCommentEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets;

    public $comment;

    public function __construct($comment)
    {
        $this->comment = $comment->load('user');
    }

    public function broadcastOn()
    {
        return new Channel('task.' . $this->comment->task_id);
    }

    public function broadcastWith()
    {
        return [
            'comment' => $this->comment
        ];
    }
}