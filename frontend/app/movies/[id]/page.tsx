// app/movies/[id]/page.tsx
export default function MoviePage({ params }: { params: { id: string } }) {
    return (
      <div>
        <h1>Movie ID:ttttt {params.id}</h1>
        <p>Details about movie {params.id}.</p>
      </div>
    );
  }
  