import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Mutation = {
  __typename?: 'Mutation';
  runPipeline: PipelineResponse;
};


export type MutationRunPipelineArgs = {
  pipeline: PipelineInput;
};

export type PipelineData = {
  __typename?: 'PipelineData';
  name: Scalars['String'];
  preset: Scalars['String'];
  repository: Scalars['String'];
};

export type PipelineInput = {
  name: Scalars['String'];
  preset: Scalars['String'];
  repository: Scalars['String'];
};

export type PipelineJob = {
  __typename?: 'PipelineJob';
  jobId?: Maybe<Scalars['String']>;
};

export type PipelineJobInput = {
  jobId?: Maybe<Scalars['String']>;
};

export type PipelineResponse = {
  __typename?: 'PipelineResponse';
  data: PipelineData;
  job: PipelineJob;
};

export type PipelineStatus = {
  __typename?: 'PipelineStatus';
  name: Scalars['String'];
  state: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  getPipelineStatus: PipelineStatus;
};


export type QueryGetPipelineStatusArgs = {
  job: PipelineJobInput;
};

export type CreatePipelineGitMutationVariables = Exact<{
  pipeline: PipelineInput;
}>;


export type CreatePipelineGitMutation = { __typename?: 'Mutation', runPipeline: { __typename?: 'PipelineResponse', data: { __typename?: 'PipelineData', name: string }, job: { __typename?: 'PipelineJob', jobId?: Maybe<string> } } };

export type GetPipelineStatusQueryVariables = Exact<{
  job: PipelineJobInput;
}>;


export type GetPipelineStatusQuery = { __typename?: 'Query', getPipelineStatus: { __typename?: 'PipelineStatus', name: string, state: string } };


export const CreatePipelineGitDocument = gql`
    mutation CreatePipelineGit($pipeline: PipelineInput!) {
  runPipeline(pipeline: $pipeline) {
    data {
      name
    }
    job {
      jobId
    }
  }
}
    `;
export type CreatePipelineGitMutationFn = Apollo.MutationFunction<CreatePipelineGitMutation, CreatePipelineGitMutationVariables>;

/**
 * __useCreatePipelineGitMutation__
 *
 * To run a mutation, you first call `useCreatePipelineGitMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePipelineGitMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPipelineGitMutation, { data, loading, error }] = useCreatePipelineGitMutation({
 *   variables: {
 *      pipeline: // value for 'pipeline'
 *   },
 * });
 */
export function useCreatePipelineGitMutation(baseOptions?: Apollo.MutationHookOptions<CreatePipelineGitMutation, CreatePipelineGitMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreatePipelineGitMutation, CreatePipelineGitMutationVariables>(CreatePipelineGitDocument, options);
      }
export type CreatePipelineGitMutationHookResult = ReturnType<typeof useCreatePipelineGitMutation>;
export type CreatePipelineGitMutationResult = Apollo.MutationResult<CreatePipelineGitMutation>;
export type CreatePipelineGitMutationOptions = Apollo.BaseMutationOptions<CreatePipelineGitMutation, CreatePipelineGitMutationVariables>;
export const GetPipelineStatusDocument = gql`
    query GetPipelineStatus($job: PipelineJobInput!) {
  getPipelineStatus(job: $job) {
    name
    state
  }
}
    `;

/**
 * __useGetPipelineStatusQuery__
 *
 * To run a query within a React component, call `useGetPipelineStatusQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPipelineStatusQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPipelineStatusQuery({
 *   variables: {
 *      job: // value for 'job'
 *   },
 * });
 */
export function useGetPipelineStatusQuery(baseOptions: Apollo.QueryHookOptions<GetPipelineStatusQuery, GetPipelineStatusQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPipelineStatusQuery, GetPipelineStatusQueryVariables>(GetPipelineStatusDocument, options);
      }
export function useGetPipelineStatusLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPipelineStatusQuery, GetPipelineStatusQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPipelineStatusQuery, GetPipelineStatusQueryVariables>(GetPipelineStatusDocument, options);
        }
export type GetPipelineStatusQueryHookResult = ReturnType<typeof useGetPipelineStatusQuery>;
export type GetPipelineStatusLazyQueryHookResult = ReturnType<typeof useGetPipelineStatusLazyQuery>;
export type GetPipelineStatusQueryResult = Apollo.QueryResult<GetPipelineStatusQuery, GetPipelineStatusQueryVariables>;