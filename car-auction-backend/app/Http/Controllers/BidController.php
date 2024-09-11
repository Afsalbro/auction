<?php

namespace App\Http\Controllers;

use App\Events\NewBidPlaced;
use App\Models\Bid;
use Illuminate\Http\Request;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\Support\Facades\Log;

class BidController extends Controller
{

    public function placeBid(Request $request)
    {
        try {
            $validated = $request->validate([
                'car_id' => 'required|integer',
                'amount' => 'required|numeric|min:1',
                'user' => 'required|integer', 
            ]);
    
            $user = $validated['user'];
            $bidCount = Bid::where('car_id', $validated['car_id'])->where('user', $user)->count();
    
            if ($bidCount < 3) {
                $bid = new Bid();
                $bid->car_id = $validated['car_id'];
                $bid->amount = (float)$validated['amount']; 
                $bid->user = $user;
                $bid->save();
    
                // Broadcast the new bid
                event(new NewBidPlaced($bid));
    
                // Get the highest bid for this user
                $highestBid = Bid::where('user', $user)->orderBy('amount', 'desc')->first();
    
                return response()->json([
                    'message' => 'Bid placed successfully',
                    'highest_bid' => $highestBid ? $highestBid->amount : 0
                ]);
            }
    
            return response()->json(['message' => 'Bid limit reached'], 403);
        } catch (\Exception $e) {
            Log::error('Error placing bid:', [
                'exception' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);
            return response()->json([
                'message' => 'An error occurred',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
}
