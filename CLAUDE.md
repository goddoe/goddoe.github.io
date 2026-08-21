# goddoe.github.io

Astro 기반 개인 블로그. Times New Roman, 아카데믹 미니멀 디자인. GitHub Pages(Actions)로 배포된다.

## 구조

- `src/content/blog/<id>.md` — 포스트. 파일명이 곧 URL(`/blog/<id>/`)
- `src/pages/` — index(글 목록), about.md, creative.astro, 404, rss.xml
- `src/layouts/`, `src/components/`, `src/styles/global.css` — 레이아웃과 스타일
- `src/plugins/remark-lang-blocks.mjs` — `:::en` / `:::ko` 디렉티브 → EN/KO 토글 블록
- `tools/` — dev 전용 웹 에디터(`/admin`). Vite dev 미들웨어라 배포 산출물에 포함되지 않음
- `public/creative/what-lies-beyond{,-2}` — 게임 서브모듈 (clone 시 `git submodule update --init`)
- `public/assets/` — 구 Jekyll 시절 이미지. 기존 URL 유지를 위해 보존
- `_drafts/`, `_data/` — 공개된 적 없는 옛 초안 아카이브. 사이트에 노출되지 않으며 건드리지 않는다

## 명령

```bash
npm run dev      # 블로그 http://localhost:4321 + 에디터 http://localhost:4321/admin
npm run build    # 프로덕션 빌드 (dist/)
```

## 포스트 작성

frontmatter: `title`, `date`, `description`(선택), `tags`(선택), `draft`(true면 로컬에서만 보임).
이중언어 글은 본문을 `:::en ... :::`과 `:::ko ... :::` 블록으로 감싼다. 수식은 `$...$`/`$$...$$`(KaTeX).

## 배포

`master`에 push되면 `.github/workflows/deploy.yml`이 빌드·배포한다. Pages 소스는 **GitHub Actions**(workflow) 모드여야 하며, 서브모듈 때문에 checkout에 `submodules: recursive`가 필요하다.

## 작업 흐름

새 작업은 **이슈 → 브랜치 → PR → squash merge** 순으로 간다. 작은 수정도 이 흐름을 따르면 나중에 "이건 왜 이렇게 됐지"를 이슈에서 되짚을 수 있다.

1. **이슈를 먼저 만든다.** 배경(무엇이 안 되는지), 목표, 이미 정해진 결정, 확인된 제약을 적는다. 조사하며 알아낸 사실도 여기 남긴다 — 다음 세션이 처음부터 다시 파헤치지 않는다.
   ```bash
   gh issue create --title "..." --body-file <파일>
   ```
   origin이 이 저장소로 잡혀 있어 `-R`은 필요 없다.

2. **브랜치 이름은 `{이슈번호}-{짧은 설명}`.** 예: `3-astro-migration`. 번호가 앞에 있어야 브랜치만 보고 맥락을 찾아간다. 기본 브랜치는 `main`이 아니라 **`master`**다.

3. **단계별로 커밋한다.** 한 커밋이 한 가지 일을 하고, 각 단계에서 `npm run build`가 통과해야 한다. 리뷰어가 커밋 단위로 따라올 수 있어야 한다.

4. **PR 본문에 되짚은 설계 결정을 적는다.** 무엇을 만들었는지보다 *왜 그렇게 했는지*, 특히 도중에 전제가 틀려 방향을 바꾼 지점이 중요하다. `Closes #N`으로 이슈를 연결한다.

5. **squash merge로 master에 넣는다.** 커밋 하나가 검증된 조합이 된다. 머지되면 곧바로 배포되므로, 머지 전에 로컬 빌드로 최종 확인한다.
   ```bash
   gh pr merge <번호> --squash --subject "..." --body-file <파일>
   ```
