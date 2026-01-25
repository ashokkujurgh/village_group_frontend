# Media Upload System - Quick Start Guide

## Files Created/Modified

### New Files:
1. **`app/types/media.ts`** - TypeScript interfaces for media
2. **`app/hooks/useUploadImage.ts`** - Hook for image upload to `/images`
3. **`app/hooks/useMediaOperations.ts`** - Hook for CRUD operations on `/medias`
4. **`app/component/MediaManager.tsx`** - Example manager component
5. **`MEDIA_UPLOAD_DOCUMENTATION.md`** - Full documentation

### Modified Files:
1. **`app/config/urls.ts`** - Added `/images` and `/medias` endpoints
2. **`app/component/UploadMediaForm.tsx`** - Completely updated with new functionality

## Quick Start

### 1. Basic Upload
```typescript
import UploadMediaForm from "@/app/component/UploadMediaForm";

export default function MyPage() {
  return (
    <UploadMediaForm
      onSuccess={(media) => console.log("Uploaded:", media)}
      onCancel={() => console.log("Cancelled")}
    />
  );
}
```

### 2. With Edit Support
```typescript
<UploadMediaForm
  mediaId="123"
  initialData={existingMedia}
  isEditing={true}
  onSuccess={(media) => console.log("Updated:", media)}
  onCancel={() => setShowForm(false)}
/>
```

### 3. Full Manager Component
```typescript
import MediaManager from "@/app/component/MediaManager";

export default function Admin() {
  return <MediaManager />;
}
```

## API Flow

### Upload Flow:
```
1. User selects image file + fills form
2. UploadMediaForm validates inputs
3. useUploadImage uploads to POST /images
4. Returns image URL
5. useMediaOperations.createMedia posts to POST /medias with image URL
6. Returns created media object
7. onSuccess callback triggered
```

### Update Flow:
```
1. User modifies media data
2. If new image: useUploadImage uploads to POST /images
3. useMediaOperations.updateMedia patches PATCH /medias/{id}
4. Returns updated media object
5. onSuccess callback triggered
```

### Delete Flow:
```
1. User clicks delete
2. useMediaOperations.deleteMedia sends DELETE /medias/{id}
3. Returns success response
4. Item removed from UI
```

## Key Features

✅ **Image Upload** - Automatic upload to `/images` before media creation
✅ **Create Media** - POST to `/medias` with all parameters
✅ **Update Media** - PATCH existing media at `/medias/{id}`
✅ **Delete Media** - DELETE at `/medias/{id}`
✅ **File Preview** - Shows image preview before upload
✅ **Loading States** - Disables form during submission
✅ **Error Handling** - Displays validation and server errors
✅ **Authentication** - Automatic token handling
✅ **File Validation** - Only accepts image files
✅ **Type Safety** - Full TypeScript support

## Parameters

All operations use `MediaParams`:
```typescript
{
  title: string;      // Media title
  type: string;       // Media type (image, document, audio, etc)
  desc: string;       // Description
  image: string;      // Image URL (from /images upload)
  video?: string;     // Optional video field
}
```

## Endpoints

| Operation | Method | Path | Auth |
|-----------|--------|------|------|
| Upload Image | POST | `/images` | Bearer token |
| Create Media | POST | `/medias` | Bearer token |
| Update Media | PATCH | `/medias/{id}` | Bearer token |
| Delete Media | DELETE | `/medias/{id}` | Bearer token |

## Environment

Required:
- `NEXT_PUBLIC_API_BASE_URL` env variable (or defaults to http://159.65.153.154:4014)
- `authToken` in localStorage (set after login)

## Testing

To test the implementation:

1. **Login first** - Ensure `authToken` is in localStorage
2. **Try uploading** - Use the form to upload media
3. **Check console** - View request/response in DevTools Network tab
4. **Verify response** - Image URL should be returned from `/images` endpoint

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Authentication token not found" | Login first, check localStorage for `authToken` |
| "Image upload failed" | Check if `/images` endpoint exists and accepts FormData |
| CORS errors | Verify server CORS settings allow your origin |
| 404 errors | Confirm `/medias` and `/images` endpoints exist on server |

## Next Steps

1. Test the upload form with real backend
2. Integrate with your existing media list/gallery component
3. Add filtering/search to MediaManager if needed
4. Customize styling to match your design system
5. Add more media types as needed

For detailed documentation, see `MEDIA_UPLOAD_DOCUMENTATION.md`
