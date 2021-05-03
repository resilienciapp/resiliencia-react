import { gql } from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};


export type AddMarkerInput = {
  description?: Maybe<Scalars['String']>;
  latitude: Scalars['Float'];
  longitude: Scalars['Float'];
  name: Scalars['String'];
};

export enum CacheControlScope {
  Public = 'PUBLIC',
  Private = 'PRIVATE'
}

export type ConfirmMarkerInput = {
  id: Scalars['Int'];
};

export type Marker = {
  __typename?: 'Marker';
  description?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  latitude: Scalars['Float'];
  longitude: Scalars['Float'];
  name: Scalars['String'];
  state: MarkerState;
};

export enum MarkerState {
  Live = 'LIVE',
  Finished = 'FINISHED'
}

export type Mutation = {
  __typename?: 'Mutation';
  addMarker: Marker;
  confirmMarker: Marker;
  removeMarker: Marker;
};


export type MutationAddMarkerArgs = {
  input: AddMarkerInput;
};


export type MutationConfirmMarkerArgs = {
  input: ConfirmMarkerInput;
};


export type MutationRemoveMarkerArgs = {
  input: RemoveMarkerInput;
};

export type Query = {
  __typename?: 'Query';
  markers: Array<Marker>;
};

export type RemoveMarkerInput = {
  id: Scalars['Int'];
};

