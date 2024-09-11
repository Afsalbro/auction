<?php

use App\Http\Controllers\BidController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });

Route::post('/place-bid', [BidController::class, 'placeBid']);

// // Route::middleware(['web'])->group(function () {
//     Route::post('/api/place-bid', [BidController::class, 'placeBid']);
// // });
