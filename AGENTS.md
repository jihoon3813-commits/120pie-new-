<!-- convex-ai-start -->

This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read
`convex/_generated/ai/guidelines.md` first** for important guidelines on
how to correctly use Convex APIs and patterns. The file contains rules that
override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running
`npx convex ai-files install`.

<!-- convex-ai-end -->

## Cloudinary 이미지 & 비디오 대역폭 최적화 규칙
- 앞으로 이미지(Image)와 동영상(Video)을 추가하거나 관련 코드를 수정할 때, 항상 Cloudinary 최적화 매개변수(`f_auto,q_auto`)를 적용하여 대역폭 소모를 최소화해야 합니다.
- 새로운 Cloudinary URL을 코드에 기입할 때는 반드시 `https://res.cloudinary.com/.../upload/f_auto,q_auto/...` 형태로 입력하거나, 공통 유틸리티 함수 `optimizeCloudinaryUrl`을 사용하여 감싸 주어야 합니다.

