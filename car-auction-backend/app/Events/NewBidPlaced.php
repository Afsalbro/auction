<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Queue\SerializesModels;
use App\Models\Bid;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Bus\Dispatchable;

class NewBidPlaced implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets;

    public $bid;

    public function __construct($bid)
    {
        $this->bid = $bid;
    }

    public function broadcastOn()
    {
        return new Channel('bids');
    }

    public function broadcastWith()
    {
        $userHighestBid = Bid::where('user', $this->bid->user)->orderBy('amount', 'desc')->first();
        return [
            'bid' => $this->bid,
            'highest_bid' => $userHighestBid ? $userHighestBid->amount : 0,
        ];
    }
}
