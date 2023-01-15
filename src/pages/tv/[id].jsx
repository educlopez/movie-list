import Head from 'next/head';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import FilmCasts from '../../components/FilmCasts';
import FilmRating from '@/components/FilmRating';
import FilmGenres from '@/components/FilmGenres';
import FilmHeading from '@/components/FilmHeading';
import FilmImage from '@/components/FilmImage';
import FilmInfo from '@/components/FilmInfo';
import FilmSynopsis from '@/components/FilmSynopsis';
import Loading from '@/components/Loading';
import { fetcher } from '@/utils';
import {
  renderLanguage,
  renderRating,
  renderStatus
} from '@/pages/movie/[id].jsx';

export default function TV() {
  const router = useRouter();
  const { id } = router.query;
  const { data: tv, error: tvError } = useSWR(`/api/tv/${id}`, fetcher);

  if (tvError) return <div>{tvError}</div>;
  if (!tv) return <div>{tvError}</div>;

  return (
    <>
      <Head>
        <title>{tv.detail.name} | Watcho</title>
      </Head>
      {tv ? (
        <>
          <div className="flex flex-col sm:mx-8 md:mx-0 md:flex-row md:items-start lg:justify-center">
            <FilmImage src={tv.detail.poster_path} title={tv.detail.name} />
            <div className="md:w-3/5">
              <FilmHeading tagline={tv.detail.tagline} title={tv.detail.name} />
              <FilmRating number={renderRating(tv.detail.vote_average)} />
              <FilmInfo
                media_type="tv"
                language={renderLanguage(tv.detail.spoken_languages || [])}
                firstAir={tv.detail.first_air_date}
                lastAir={tv.detail.last_air_date}
                status={renderStatus(tv.detail.status)}
              />
              <FilmGenres genres={tv.detail.genres || []} />
              <FilmSynopsis synopsis={tv.detail.overview} />
            </div>
          </div>
          <div className="flex flex-col mt-4 sm:mx-8 md:mx-0 md:flex-row md:items-start lg:justify-center">
            <FilmCasts casts={tv.credits.cast} />
          </div>
        </>
      ) : (
        <Loading />
      )}
    </>
  );
}
