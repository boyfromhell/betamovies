<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use function Laravel\Prompts\text;
use Illuminate\Support\Facades\Hash;
use function Laravel\Prompts\confirm;
use function Laravel\Prompts\password;
use function Laravel\Prompts\info;

class FilamentUser extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'make:admin';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'This command creates a new user as an admin for filament panel';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        //
        $name = text(
            label: 'Name',
            placeholder: 'E.g. Tony',
            required: 'Your name is required',
        );
        $email = text(
            label: 'Email',
            placeholder: 'E.g. admin@gmail.com',
            required: 'Your email is required',
        );
        $password = password(
            label: 'Password',
            required: true,
        );
        $isAdmin = confirm(
            label: 'Is this user an admin?',
            default: true,
            yes: 'Yes',
            no: 'No',
        );

        // check if the admin is already created
        $getAdmin = User::where('email', $email)->first();
        
        if ($getAdmin && $getAdmin->is_admin == true) {
            info('This admin already exists');
        } elseif ($getAdmin && $getAdmin->is_admin == false) {
            info('This email already exists and it is not an admin');
        } else {
            $newAdmin = User::create([
                'name' => $name,
                'email' => $email,
                'password' => Hash::make($password),
                'is_admin' => $isAdmin,
            ]);
            
            if ($newAdmin) {
                info('Admin created successfully');
            } else {
                info('Failed to create admin');
            }
        }
    }
}
