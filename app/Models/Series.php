<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Laravel\Scout\Searchable;

class Series extends Model
{
    use Searchable;

    //
    protected $fillable = [
        'movieId',
        'name',
        'formatted_name',
        'poster_path',
        'backdrop_path',
        'origin_country',
        'language',
        'overview',
        'release_date',
        'release_year',
        'vote_count',
        'type',
        'runtime',
        'genres',
        'trailer',
        'status',
        'approved_at',
        'downloads',
        'popularity',
    ];

    public function series()
    {
        return $this->hasMany(Seasons::class);
    }

    public function toSearchableArray()
    {
        $array = $this->toArray();

        $array['name'] = $this->full_name;

        // Customize array...

        return $array;
    }
}
