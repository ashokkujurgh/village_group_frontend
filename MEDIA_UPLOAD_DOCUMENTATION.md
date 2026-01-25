# Media Upload System Documentation

## Overview
This media upload system provides complete CRUD operations for media management with image handling support. The system automatically uploads images to the `/images` endpoint before creating media records.

## Architecture

### 1. **Types** (`app/types/media.ts`)
Defines TypeScript interfaces for media operations:
- `MediaParams` - Main media parameters (title, type, desc, image, video)
- `ImageUploadResponse` - Response from image upload endpoint
- `MediaResponse` - Response from media operations
- `Media` - Full media object with database fields

### 2. **Hooks**

#### `useUploadImage.ts`
Handles image file uploads to `/images` endpoint.

**Usage:**
```typescript
const { uploadImage, loading, error } = useUploadImage();
const imageUrl = await uploadImage(file);
```

**Features:**
- Sends file as FormData
- Includes authentication token
- Returns image URL on success
- Error handling with meaningful messages

#### `useMediaOperations.ts`
Handles POST, PATCH, DELETE operations on `/medias` endpoint.

**Methods:**

**Create Media (POST):**
```typescript
const { createMedia, loading, error } = useMediaOperations();
const media = await createMedia({
  title: "My Image",
  type: "image",
  desc: "Description",
  image: "http://...",
  video: ""
});
```

**Update Media (PATCH):**
```typescript
const media = await updateMedia(mediaId, {
  title: "Updated Title",
  desc: "Updated Description"
});
```

**Delete Media (DELETE):**
```typescript
const success = await deleteMedia(mediaId);
```

### 3. **Components**

#### `UploadMediaForm.tsx`
Main form component for uploading and editing media.

**Props:**
```typescript
interface UploadMediaFormProps {
  mediaId?: string;           // For editing
  initialData?: Partial<MediaParams>;
  isEditing?: boolean;
  onSuccess?: (media: any) => void;
  onCancel?: () => void;
}
```

**Features:**
- Image file upload with preview
- Title, type, and description fields
- Media type selector (Image, Document, Audio, Other)
- File validation and size display
- Loading states during upload
- Error handling and display
- Support for both create and update operations

**Usage:**
```typescript
// Upload new media
<UploadMediaForm 
  onSuccess={(media) => console.log("Uploaded", media)}
  onCancel={() => setShowForm(false)}
/>

// Edit existing media
<UploadMediaForm 
  mediaId="123"
  initialData={existingMedia}
  isEditing={true}
  onSuccess={(media) => console.log("Updated", media)}
  onCancel={() => setShowForm(false)}
/>
```

#### `MediaManager.tsx`
Example manager component demonstrating full CRUD operations.

**Features:**
- Display list of uploaded media
- Add new media form
- Edit media functionality
- Delete media with confirmation
- Success/error messages

## API Endpoints

### Image Upload
- **Endpoint:** `/images`
- **Method:** POST
- **Headers:** 
  - `Authorization: Bearer {token}`
- **Body:** FormData with `image` field
- **Response:**
  ```json
  {
    "success": true,
    "message": "Image uploaded successfully",
    "image": "http://cdn.example.com/image.jpg"
  }
  ```

### Media Operations
- **Endpoint:** `/medias`
- **Base URL:** Configured in `app/config/urls.ts`

#### Create Media
- **Method:** POST
- **Headers:** 
  - `Content-Type: application/json`
  - `Authorization: Bearer {token}`
- **Body:**
  ```json
  {
    "title": "string",
    "type": "string",
    "desc": "string",
    "image": "string",
    "video": "string"
  }
  ```

#### Update Media
- **Method:** PATCH
- **URL:** `/medias/{id}`
- **Headers:** Same as create
- **Body:** Partial media object

#### Delete Media
- **Method:** DELETE
- **URL:** `/medias/{id}`
- **Headers:** Authorization header only

## Configuration

### Update `app/config/urls.ts`
The endpoints are already added:
```typescript
export const API_ENDPOINTS = {
  // ...
  IMAGES: "/images",
  MEDIAS: "/medias",
};
```

## Implementation Flow

### Upload Process:
1. User selects image file and fills in media details
2. Form validates inputs
3. Image uploaded to `/images` endpoint
4. API returns image URL
5. Media record created with image URL
6. Success callback triggered

### Update Process:
1. Form loads with initial media data
2. User can select new image or keep existing
3. If new image selected, upload to `/images` first
4. Update media record via PATCH
5. Success callback triggered

### Delete Process:
1. User clicks delete button
2. Confirmation dialog shown
3. DELETE request sent to `/medias/{id}`
4. Record removed from list
5. Success message displayed

## Error Handling

All hooks provide:
- `loading` state during operations
- `error` message for failures
- Automatic error clearing on retry
- Authentication validation

## Security Features

- **Token-based Authentication:** All requests include Bearer token
- **Authorization:** Token must be present in localStorage
- **File Validation:** Only image files accepted
- **Content-Type Headers:** Proper headers for file uploads

## Environment Setup

1. Ensure `NEXT_PUBLIC_API_BASE_URL` is configured (defaults to `http://159.65.153.154:4014`)
2. Authentication token must be stored in localStorage as `authToken`
3. Server must be running and accessible

## Examples

### Complete Upload Flow:
```typescript
import { useState } from "react";
import UploadMediaForm from "@/app/component/UploadMediaForm";

export default function MediaUploadPage() {
  const [media, setMedia] = useState(null);
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="p-6">
      <button
        onClick={() => setShowForm(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Upload Media
      </button>

      {showForm && (
        <UploadMediaForm
          onSuccess={(newMedia) => {
            setMedia(newMedia);
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {media && (
        <div className="mt-6">
          <img src={media.image} alt={media.title} />
          <h2>{media.title}</h2>
          <p>{media.desc}</p>
        </div>
      )}
    </div>
  );
}
```

### Complete CRUD Manager:
See `app/component/MediaManager.tsx` for a full-featured example.

## Notes

- Video upload is skipped as per requirements
- Image is mandatory; video field is optional
- All async operations use try-catch error handling
- Form states (loading, submitting) prevent double submissions
- File size is displayed in human-readable format
