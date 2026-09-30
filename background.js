// IndexedDB stores photo files locally, even after Chrome is restarted.
// Keep this feature separate from the clocks and to-do list.
const photoInput = document.getElementById("photo-input");
const photoStatus = document.getElementById("photo-status");
const photoGallery = document.getElementById("photo-gallery");
const MAX_PHOTOS = 10;
let photoDatabase;
let photoUrls = [];
let currentPhotoId;
let uploadingPhotos = false;

function openPhotoDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("my-momentum-photos", 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore("photos", { keyPath: "id" });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function readPhotos() {
  return new Promise((resolve, reject) => {
    const request = photoDatabase.transaction("photos").objectStore("photos").getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Count and write in the same transaction, including when multiple tabs upload.
function addPhotos(photos) {
  return new Promise((resolve, reject) => {
    const transaction = photoDatabase.transaction("photos", "readwrite");
    const store = transaction.objectStore("photos");
    const count = store.count();
    let full = false;
    count.onsuccess = () => {
      if (count.result + photos.length > MAX_PHOTOS) {
        full = true;
        transaction.abort();
        return;
      }
      photos.forEach(photo => store.add(photo));
    };
    transaction.oncomplete = resolve;
    transaction.onabort = () => reject(new Error(full
      ? "Only 10 photos fit in the library. Remove a photo or choose fewer files."
      : "Photos could not be saved. Your browser storage may be full."));
  });
}

function deletePhoto(id) {
  return new Promise((resolve, reject) => {
    const transaction = photoDatabase.transaction("photos", "readwrite");
    transaction.objectStore("photos").delete(id);
    transaction.oncomplete = resolve;
    transaction.onabort = () => reject(new Error("The photo could not be removed."));
  });
}

async function showPhotoLibrary() {
  const photos = await readPhotos();
  photoUrls.forEach(url => URL.revokeObjectURL(url));
  photoUrls = photos.map(photo => URL.createObjectURL(photo.file));
  photoGallery.replaceChildren();
  photoStatus.textContent = `${photos.length} / ${MAX_PHOTOS} photos saved on this device.`;

  // Keep the current background while editing; pick randomly on each new page.
  let selected = photos.findIndex(photo => photo.id === currentPhotoId);
  if (selected === -1 && photos.length) selected = Math.floor(Math.random() * photos.length);
  currentPhotoId = photos[selected]?.id;
  document.body.style.backgroundImage = selected === -1 ? "none"
    : `linear-gradient(#00000033, #00000033), url("${photoUrls[selected]}")`;

  photos.forEach((photo, index) => {
    const preview = document.createElement("figure");
    preview.className = "photo-preview";
    const image = document.createElement("img");
    image.src = photoUrls[index];
    image.alt = photo.name;
    const caption = document.createElement("figcaption");
    caption.textContent = photo.name;
    const remove = document.createElement("button");
    remove.type = "button";
    remove.textContent = "Remove";
    remove.setAttribute("aria-label", `Remove ${photo.name}`);
    remove.disabled = uploadingPhotos;
    remove.addEventListener("click", async () => {
      remove.disabled = true;
      try {
        await deletePhoto(photo.id);
        await showPhotoLibrary();
      } catch (error) {
        photoStatus.textContent = error.message;
        remove.disabled = false;
      }
    });
    preview.append(image, caption, remove);
    photoGallery.append(preview);
  });
}

photoInput.addEventListener("change", async () => {
  const files = [...photoInput.files];
  if (!files.length) return;
  uploadingPhotos = true;
  photoInput.disabled = true;
  photoGallery.querySelectorAll("button").forEach(button => button.disabled = true);
  photoStatus.textContent = "Saving photos…";
  try {
    if (files.length > MAX_PHOTOS) throw new Error("Please select at most 10 photos.");
    for (const file of files) {
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        throw new Error("Please choose JPEG, PNG, or WebP photos.");
      }
      if (file.size > 10 * 1024 * 1024) throw new Error("Each photo must be 10 MB or smaller.");
      // Check that the file really can be displayed before saving anything.
      let bitmap;
      try { bitmap = await createImageBitmap(file); }
      catch { throw new Error(`Could not open ${file.name}. Please choose another photo.`); }
      bitmap.close();
    }
    await addPhotos(files.map(file => ({ id: crypto.randomUUID(), name: file.name, file })));
    await showPhotoLibrary();
  } catch (error) {
    photoStatus.textContent = error.message;
  } finally {
    uploadingPhotos = false;
    photoInput.disabled = false;
    photoInput.value = "";
    photoGallery.querySelectorAll("button").forEach(button => button.disabled = false);
  }
});

async function startBackgrounds() {
  try {
    photoDatabase = await openPhotoDatabase();
    await showPhotoLibrary();
    photoInput.disabled = false;
  } catch {
    photoStatus.textContent = "Your photo library could not be opened. Please reload this tab.";
  }
}

startBackgrounds();
