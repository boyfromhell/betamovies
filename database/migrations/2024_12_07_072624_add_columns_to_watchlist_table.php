<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('my_lists', function (Blueprint $table) {
            //
            $table->string('userId')->nullable()->after('id');
            $table->string('userName')->nullable()->after('userId');
            $table->timestamp('deleted_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('my_lists', function (Blueprint $table) {
            //
        });
    }
};
