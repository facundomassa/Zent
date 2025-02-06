<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;

class CommentDeletedEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets;

    public $commentId;
    public $taskId;

    public function __construct($commentId, $taskId)
    {
        $this->commentId = $commentId;
        $this->taskId = $taskId;
    }

    public function broadcastOn()
    {
        return new Channel('task.' . $this->taskId);
    }

    public function broadcastWith()
    {
        return [
            'commentId' => $this->commentId
        ];
    }

    // Este es el nombre que se usará en el frontend
    public function broadcastAs()
    {
        return 'CommentDeleted';
    }
}