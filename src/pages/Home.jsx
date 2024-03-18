import React, { useContext } from "react";
import { useQuery } from "@apollo/client";
import { Grid, GridColumn, GridRow,Transition,TransitionGroup } from "semantic-ui-react";
import PostCard from "../components/PostCard";
import { AuthContext } from "../context/auth";
import PostForm from "../components/PostForm";
import { FETCH_POST_QUERY } from "../util/graphql";

const Home = () => {

  const {user } = useContext(AuthContext)

  const { loading, data } = useQuery(FETCH_POST_QUERY);

  return (
    <Grid columns={3}>
      <GridRow className="page-title">
        <h1>Recent Posts</h1>
      </GridRow>
      <GridRow>
        {user &&(
          <GridColumn>
            <PostForm/>
          </GridColumn>
        )}
        {loading ? (
          <h1>Loading Posts...</h1>
        ) : (
          <TransitionGroup>
            {data?.posts &&
            data?.posts.map((post) => (
              <GridColumn key={post.id} style={{ marginBottom: 20 }}>
                <PostCard post={post} />
              </GridColumn>
            ))}

          </TransitionGroup>

        )}
      </GridRow>
    </Grid>
  );
};



export default Home;
