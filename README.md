# 쇼핑몰 어드민 페이지

### 1. 프로젝트 셋팅

- Next.js 프로젝트 생성

```js
npx create-next-app shopping-mall-admin

not use TypeScript
use ESLint
not use src/
not use app/
```

- tailwindcss 설치

```js
// 패키지 설치
npm i -D tailwindcss postcss autoprefixer

// 설정파일 생성
npx tailwindcss init -p

// tailwindcss.config.js
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

// global.css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

</br>

### 2. `next/auth`를 이용한 로그인 기능 구현

- pages/api/auth/[...nextauth].js 파일 생성 후 GoogleProvider 설정

```js
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
});
```

- \_app.js 파일에 SessionProvider 설정

```js
import { SessionProvider } from "next-auth/react";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
```

- 로그인 여부에 따른 컴포넌트 렌더링

```js
 const { data: session } = useSession();

  if (!session) {
    return (
    // 로그인 되어있지 않을 때 보여줄 컴포넌트
        <button
            onClick={() => signIn("google")}
            className="bg-white p-2 px-4 rounded-lg"
        >
            Login with Google
        </button>
    );
  }

  return (
    // 로그인 되어있을 때 보여줄 컴포넌트
  )
```

- `MongoDB` 연동

  - 패키지 설치

    ```js
    npm i next-auth @next-auth/mongodb-adapter mongodb
    ```

  - lib/mongodb.js 파일 생성  
    매 실행시마다 mongoClient를 새로 생성하는 대신 기존 mongoClient를 사용

  - adapter 설정

    ```js
    // pages/api/auth/[...nextauth].js
    import { MongoDBAdapter } from "@auth/mongodb-adapter";
    import clientPromise from "@/lib/mongodb";

    export default NextAuth({
      providers: [
        GoogleProvider({
          clientId: process.env.GOOGLE_ID,
          clientSecret: process.env.GOOGLE_SECRET,
        }),
      ],
      adapter: MongoDBAdapter(clientPromise),
    });
    ```

  - 환경변수 설정  
    MongoDB Atlas에서 프로젝트 생성한 후 ip 주소를 모든 ip를 허용하도록 변경  
    루트 폴더에 .env 파일 생성 후 환경변수 설정

    ```js
    // .env
    MONGODB_URI=mongodb+srv: ...
    ```

</br>

### 3. 라우팅

- 별도 라이브러리를 설치할 필요 없이, pages 폴더에 각 페이지 이름에 해당하는 하위 폴더를 생성하면 자동으로 라우팅 된다.

```js
/pages/index.js -> `/`
/pages/categories.js -> `/categories`
/pages/products/index.js -> `/products`
/pages/edit/[...id].js -> `/products/edit/:id`
```

</br>

### 4. API 생성

- pages/api 폴더에 있는 파일은 `/api/*`로 매핑되어 페이지 대신 API 엔드포인트로 처리된다.

- req, res를 인자로 받는 handler 함수를 default로 내보내고, http 메서드는 req.method를 통해 처리한다.

```js
export default function handler(req, res) {
  const { method } = req;

  if (method === "GET") {
    ...
    res.json(data)
  }

  if (method === "POST") {
    ...
    res.json(true)
  }
}
```
