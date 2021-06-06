/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AddMarkerMutation
// ====================================================

export interface AddMarkerMutation_addMarker_category {
  description: string | null;
  id: number;
  name: string;
}

export interface AddMarkerMutation_addMarker {
  active: boolean;
  category: AddMarkerMutation_addMarker_category;
  description: string | null;
  expiresAt: any | null;
  id: number;
  latitude: number;
  longitude: number;
  name: string;
  recurrence: string;
}

export interface AddMarkerMutation {
  addMarker: AddMarkerMutation_addMarker[];
}

export interface AddMarkerMutationVariables {
  input: AddMarkerInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: CategoriesQuery
// ====================================================

export interface CategoriesQuery_categories {
  description: string | null;
  id: number;
  name: string;
}

export interface CategoriesQuery {
  categories: CategoriesQuery_categories[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: MarkersQuery
// ====================================================

export interface MarkersQuery_markers_category {
  description: string | null;
  id: number;
  name: string;
}

export interface MarkersQuery_markers {
  active: boolean;
  category: MarkersQuery_markers_category;
  description: string | null;
  expiresAt: any | null;
  id: number;
  latitude: number;
  longitude: number;
  name: string;
  recurrence: string;
}

export interface MarkersQuery {
  markers: MarkersQuery_markers[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: Category
// ====================================================

export interface Category {
  description: string | null;
  id: number;
  name: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: Marker
// ====================================================

export interface Marker_category {
  description: string | null;
  id: number;
  name: string;
}

export interface Marker {
  active: boolean;
  category: Marker_category;
  description: string | null;
  expiresAt: any | null;
  id: number;
  latitude: number;
  longitude: number;
  name: string;
  recurrence: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export interface AddMarkerInput {
  category: number;
  description?: string | null;
  expiresAt?: any | null;
  latitude: number;
  longitude: number;
  name: string;
  recurrence: string;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
