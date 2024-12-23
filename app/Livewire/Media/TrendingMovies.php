<?php

namespace App\Livewire\Media;

use App\Models\Movies;
use Livewire\Component;
use Livewire\WithPagination;

class TrendingMovies extends Component
{
    use WithPagination;

    public $yearFilter = null;

    public function placeholder()
    {
        return view('placeholder');
    }

    public function updated($key)
    {
        if ($key === 'yearFilter') {
            $this->resetPage();
        }
    }

    public function refresh()
    {
        $this->reset();
        $this->resetPage();
    }

    public function render()
    {
        $trending_movies_query = Movies::where('popularity', '>=', 100)
            ->where('status', '!=', 'pending')
            ->whereNull('deleted_at')
            ->orderByDesc('popularity');

        if ($this->yearFilter) {
            $trending_movies_query->where('release_year', $this->yearFilter);
        }

        $trending_movies = $trending_movies_query->paginate('36');

        $year = Movies::pluck('release_year')
            ->filter(fn ($year) => ! empty($year))
            ->unique()
            ->sortDesc()
            ->values();

        return view('livewire.media.trending-movies', compact('trending_movies', 'year'));
    }
}
