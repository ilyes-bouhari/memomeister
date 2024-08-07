export type Maybe<T> = T | null
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
}

export type PageInfo = {
  __typename?: "PageInfo"
  hasNextPage: Scalars["Boolean"]
  hasPreviousPage: Scalars["Boolean"]
  startCursor?: Maybe<Scalars["String"]>
  endCursor?: Maybe<Scalars["String"]>
}

export type FolderSubfoldersEdge = {
  __typename?: "FolderSubfoldersEdge"
  node: FolderType
  cursor: Scalars["String"]
  isUserFavorite?: Maybe<Scalars["Boolean"]>
  documentCountWithSubfolder?: Maybe<Scalars["Int"]>
}

export type FolderSubfoldersConnection = {
  __typename?: "FolderSubfoldersConnection"
  pageInfo: PageInfo
  edges?: Maybe<Array<Maybe<FolderSubfoldersEdge>>>
}

export type UserType = {
  __typename?: "UserType"
  id: Scalars["ID"]
  dbId?: Maybe<Scalars["String"]>
  firstName?: Maybe<Scalars["String"]>
  lastName?: Maybe<Scalars["String"]>
  fullName?: Maybe<Scalars["String"]>
  avatar?: Maybe<Scalars["String"]>
  phoneNumber?: Maybe<Scalars["String"]>
  emails?: Maybe<Array<Maybe<EmailType>>>
  primaryEmail?: Maybe<Scalars["String"]>
  primaryEmailVerified?: Maybe<Scalars["String"]>
  isStaff?: Maybe<Scalars["Boolean"]>
  forceToVerifyEmail?: Maybe<Scalars["Boolean"]>
  groups?: Maybe<Array<Maybe<GroupType>>>
  activeCompanyRole?: Maybe<Scalars["Int"]>
  lastSeen?: Maybe<Scalars["String"]>
}

export type FolderType = {
  __typename?: "FolderType"
  id: Scalars["ID"]
  dbId?: Maybe<Scalars["String"]>
  name: Scalars["String"]
  description?: Maybe<Scalars["String"]>
  labels?: Maybe<Array<Maybe<Scalars["String"]>>>
  isShared?: Maybe<Scalars["Boolean"]>
  createdAsParent?: Maybe<Scalars["Boolean"]>
  hasSubfolders?: Maybe<Scalars["Boolean"]>
  subfolders?: Maybe<FolderSubfoldersConnection>
  documentCount?: Maybe<Scalars["Int"]>
  documentCountWithSubfolder?: Maybe<Scalars["Int"]>
  creator?: Maybe<UserType>
  isCreatedByCurrentUser?: Maybe<Scalars["Boolean"]>
  createdAt?: Maybe<Scalars["String"]>
  lastActivity?: Maybe<Scalars["String"]>
  lastModified?: Maybe<Scalars["String"]>
  emoteIcon?: Maybe<Scalars["String"]>
  folderLevel?: Maybe<Scalars["Int"]>
  breadcrumb?: Maybe<Array<Maybe<BreadCrumbType>>>
  containsTemplates?: Maybe<Scalars["Boolean"]>
  isArchivedDirectly?: Maybe<Scalars["Boolean"]>
  isRemovedDirectly?: Maybe<Scalars["Boolean"]>
  isArchived?: Maybe<Scalars["Boolean"]>
  isRemoved?: Maybe<Scalars["Boolean"]>
  removedAt?: Maybe<Scalars["String"]>
  archivedAt?: Maybe<Scalars["String"]>
  archivedFacetMonth?: Maybe<Scalars["Int"]>
  archivedFacetYear?: Maybe<Scalars["Int"]>
  parentArchivedId?: Maybe<Scalars["String"]>
  parentBinId?: Maybe<Scalars["String"]>
  parentId?: Maybe<Scalars["String"]>
  parentFolder?: Maybe<FolderType>
  parentFolderName?: Maybe<Scalars["String"]>
  isCurrentUserFavorite?: Maybe<Scalars["Boolean"]>
  hasAccessOnDetails?: Maybe<Scalars["Boolean"]>
  permissionsUsers?: Maybe<Array<Maybe<UserType>>>
  permissionsGroups?: Maybe<Array<Maybe<GroupType>>>
  location?: Maybe<LocationType>
  locationLongName?: Maybe<Scalars["String"]>
  geoLocationDetails?: Maybe<GeoLocationType>
  contactAndProjectDetails?: Maybe<ContactAndProjectDetailsType>
  section?: Maybe<FolderSection>
}

export type FolderTypeSubfoldersArgs = {
  after?: Maybe<Scalars["String"]>
  first?: Maybe<Scalars["Int"]>
}

export type EmailType = {
  __typename?: "EmailType"
  id?: Maybe<Scalars["String"]>
  address?: Maybe<Scalars["String"]>
  verified?: Maybe<Scalars["Boolean"]>
}

export type GroupType = {
  __typename?: "GroupType"
  id: Scalars["ID"]
  dbId?: Maybe<Scalars["String"]>
  name?: Maybe<Scalars["String"]>
  createdAt?: Maybe<Scalars["String"]>
  isDefault?: Maybe<Scalars["Boolean"]>
  isFixed?: Maybe<Scalars["Boolean"]>
  description?: Maybe<Scalars["String"]>
  isSystem?: Maybe<Scalars["Boolean"]>
  systemType?: Maybe<Scalars["String"]>
  users?: Maybe<Array<Maybe<UserType>>>
}

export type BreadCrumbType = {
  __typename?: "BreadCrumbType"
  id: Scalars["ID"]
  dbId?: Maybe<Scalars["String"]>
  description?: Maybe<Scalars["String"]>
  emoteIcon?: Maybe<Scalars["String"]>
  name?: Maybe<Scalars["String"]>
}

export type LocationType = {
  __typename?: "LocationType"
  id?: Maybe<Scalars["String"]>
  city?: Maybe<Scalars["String"]>
  country?: Maybe<Scalars["String"]>
  region?: Maybe<Scalars["String"]>
  longName?: Maybe<Scalars["String"]>
  latitude?: Maybe<Scalars["Float"]>
  longitude?: Maybe<Scalars["Float"]>
  latLong?: Maybe<Array<Maybe<Scalars["Float"]>>>
}

export type GeoLocationType = {
  __typename?: "GeoLocationType"
  id: Scalars["ID"]
  name?: Maybe<Scalars["String"]>
  latitude?: Maybe<Scalars["Float"]>
  longitude?: Maybe<Scalars["Float"]>
  address?: Maybe<GeoAddressType>
}

export type ContactAndProjectDetailsType = {
  __typename?: "ContactAndProjectDetailsType"
  postalcode?: Maybe<Scalars["String"]>
  city?: Maybe<Scalars["String"]>
  address?: Maybe<Scalars["String"]>
  contacts?: Maybe<Array<Maybe<ContactType>>>
}

export enum FolderSection {
  FolderTemplates = "FOLDER_TEMPLATES",
  MainFolders = "MAIN_FOLDERS",
  Archive = "ARCHIVE",
  Bin = "BIN"
}

export type GeoAddressType = {
  __typename?: "GeoAddressType"
  houseNr?: Maybe<Scalars["String"]>
  street?: Maybe<Scalars["String"]>
  city?: Maybe<Scalars["String"]>
  postcode?: Maybe<Scalars["String"]>
  country?: Maybe<Scalars["String"]>
}

export type ContactType = {
  __typename?: "ContactType"
  name?: Maybe<Scalars["String"]>
  email?: Maybe<Scalars["String"]>
  telephone?: Maybe<Scalars["String"]>
}

export type DefaultPermissionType = {
  __typename?: "DefaultPermissionType"
  groups?: Maybe<Array<Maybe<GroupType>>>
  users?: Maybe<Array<Maybe<UserType>>>
}


export type FolderFormValues = {
  id: string;
  name: string;
  parentId: string;
}