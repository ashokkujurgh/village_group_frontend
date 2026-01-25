# Media Edit Implementation Summary

## Created Custom Hook

### `useEditMedia.ts`
A focused hook for updating media items via PATCH request.

**Usage:**
```typescript
const { editMedia, loading, error } = useEditMedia();

const result = await editMedia(mediaId, {
  title: "Updated Title",
  type: "image",
  desc: "Updated Description",
  image: "https://..."
});
```

**Returns:**
- `editMedia(mediaId, mediaData)` - Function to update media, returns Media object or null
- `loading` - Loading state during update
- `error` - Error message if update fails

**Features:**
- PATCH request to `/medias/{mediaId}`
- Automatic token authentication
- Partial updates supported
- Error handling with descriptive messages

---

## Updated Components

### `MediaList.tsx`
Added edit functionality with new prop:

**New Prop:**
```typescript
onEdit: (mediaId: string, mediaData: Media) => void;
```

**Edit Button:**
- Calls `onEdit()` when clicked
- Passes media ID and full media object
- Styled with blue background for distinction from delete

---

### `AdminContent.tsx`
Integrated edit media workflow:

**New Imports:**
- `useEditMedia` hook

**New State:**
```typescript
const [editingMediaId, setEditingMediaId] = useState<string | null>(null);
const [editingMediaData, setEditingMediaData] = useState<any>(null);
```

**New Handler:**
```typescript
const handleEditMedia = (mediaId: string, mediaData: any) => {
  setEditingMediaId(mediaId);
  setEditingMediaData({
    title: mediaData.title,
    type: mediaData.type,
    desc: mediaData.desc,
    image: mediaData.image,
  });
  setShowUploadForm(true);
};
```

**Updated MediaList:**
```tsx
<MediaList
  media={media}
  loading={mediaLoading}
  error={mediaError}
  onUpload={() => {
    setEditingMediaId(null);
    setEditingMediaData(null);
    setShowUploadForm(true);
  }}
  onEdit={handleEditMedia}
  onDelete={handleDeleteMedia}
/>
```

**Updated Dialog:**
- Title changes based on `editingMediaId`: "Edit Media" or "Upload Media"
- Dialog closes and resets state on success
- UploadMediaForm receives:
  - `mediaId` - For PATCH request
  - `initialData` - Pre-filled form values
  - `isEditing` - Flag for edit mode
  - `onSuccess` - Callback to refresh list

---

## Complete Edit Flow

1. **User clicks Edit button** in MediaList
   ↓
2. **handleEditMedia()** is called with mediaId and media object
   ↓
3. **State is set:**
   - `editingMediaId` = media's ID
   - `editingMediaData` = title, type, desc, image
   ↓
4. **Upload dialog opens** with "Edit Media" title
   ↓
5. **UploadMediaForm loads** with:
   - Form pre-filled with existing values
   - `isEditing={true}` flag
   - Image preview from existing data
   ↓
6. **User modifies** title, type, desc, or image
   ↓
7. **Submit triggers:**
   - If new image: Upload to `/images` endpoint
   - Call `updateMedia()` with PATCH to `/medias/{id}`
   ↓
8. **On success:**
   - List refreshes via `fetchMedias()`
   - Dialog closes
   - State resets
   - User sees updated media in list

---

## File Structure

```
app/
├── hooks/
│   ├── useEditMedia.ts         (NEW)
│   ├── useFetchMedias.ts       (EXISTING)
│   └── useDeleteMedia.ts       (EXISTING)
├── component/
│   ├── MediaList.tsx           (UPDATED - added onEdit prop)
│   └── UploadMediaForm.tsx     (EXISTING - already supports edit)
└── admin/
    └── AdminContent.tsx        (UPDATED - added edit handler)
```

---

## Integration Features

✅ **Edit State Management** - Separate state for editing media
✅ **Pre-filled Form** - Initial data loaded in UploadMediaForm
✅ **Dialog Title** - Changes based on edit/create mode
✅ **State Reset** - Clears editing state after cancel/success
✅ **List Refresh** - Auto-updates list after successful edit
✅ **Consistent Pattern** - Follows news edit pattern from AdminContent
✅ **Error Handling** - Errors displayed in form
✅ **Loading States** - UI disabled during updates

---

## Testing Checklist

- [ ] Click Edit button - Dialog opens with title "Edit Media"
- [ ] Form fields pre-populated with existing values
- [ ] Image shows preview from existing URL
- [ ] Can update title and description
- [ ] Can replace image with new one
- [ ] Submit updates media in backend
- [ ] List refreshes with updated values
- [ ] Dialog closes and state resets
- [ ] Cancel button clears editing state
