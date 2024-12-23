<?php

namespace App\Livewire\Media;

use App\Models\Movies;
use App\Models\Series;
use Illuminate\Pagination\LengthAwarePaginator;
use Livewire\Component;
use Livewire\WithoutUrlPagination;
use Livewire\WithPagination;

class TopRated extends Component
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
        $top_rated_movies_query = Movies::where('status', '!=', 'pending')
            ->where('vote_count', '>', 6)
            ->whereNull('deleted_at')
            ->orderByDesc('approved_at')
            ->orderByDesc('id');

        $top_rated_series_query = Series::where('status', '!=', 'pending')
            ->where('vote_count', '>', 6)
            ->whereNull('deleted_at')
            ->orderByDesc('approved_at')
            ->orderByDesc('id');

        if ($this->yearFilter) {
            $top_rated_movies_query->where('release_year', $this->yearFilter);
            $top_rated_series_query->where('release_year', $this->yearFilter);
        }

        $top_rated_movies = $top_rated_movies_query->get();
        $top_rated_series = $top_rated_series_query->get();

        $top_rated = $top_rated_movies->concat($top_rated_series);

        $page = LengthAwarePaginator::resolveCurrentPage() ?: 1;

        // Items per page
        $perPage = 36;

        // Slice the collection to get the items to display in current page
        $currentPageResults = $top_rated->slice(($page * $perPage) - $perPage, $perPage)->values();

        // Create our paginator and add it to the view
        $paginatedResults = new LengthAwarePaginator($currentPageResults, count($top_rated), $perPage, $page, ['path' => LengthAwarePaginator::resolveCurrentPath()]);

        $year = Movies::pluck('release_year')
            ->concat(Series::pluck('release_year'))
            ->filter(fn ($year) => ! empty($year)) // Remove empty years
            ->unique()
            ->sortDesc() // Sort by latest year (descending)
            ->values();

        return view('livewire.media.top-rated', compact('paginatedResults', 'year'));
    }
}
