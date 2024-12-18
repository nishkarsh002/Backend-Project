import StartupCard, { StartupTypeCard } from "@/components/StartupCard";
import SearchForm from "../../components/SearchForm";
import { STARTUPS_QUERY } from "@/sanity/lib/queries";
import { sanityFetch, SanityLive } from "@/sanity/lib/live";
import { auth } from "@/auth";

export default async function Home( {searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {

  const query = (await searchParams).query;
  const params = {search : query || null};
  // const posts = await client.fetch(STARTUPS_QUERY);

  const session = await auth();
  // console.log("session id:",session?.id)


  const { data: posts } = await sanityFetch({query: STARTUPS_QUERY , params});
  // console.log(JSON.stringify(posts , null , 2))
  
  return(
    <>
       <section className="pink_container">
        <h1 className="heading"> Pitch Your Idea of the Startup
        </h1>
        <p className="sub-heading !max-w-3xl">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos, molestias!
        </p>

        <SearchForm query={query}/>

       </section>

       <section className="section_container">
        <p className="text-30-semibold">
          { query ? `Search results for "${query}"` : "All Startups"}
        </p>
        <ul className="mt-7 card_grid">
          {posts?.length > 0 ? (
            posts.map((post: StartupTypeCard)=>(
            <StartupCard key={post?._id} post={post} />
            ))
          ): (
            <p className="no-results">No startup found</p>
          )}
        </ul>
       </section>

       <SanityLive />
    </>
  );
}
