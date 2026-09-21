update storage.buckets
set allowed_mime_types = array[
  'application/pdf','application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain','image/jpeg','image/png','image/webp','image/gif',
  'video/mp4','video/webm','video/quicktime'
]::text[]
where id = 'documents';
