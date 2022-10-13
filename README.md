
Суть приложения: историческая викторина, где пользователю выдаются карточки 3 категорий(люди/события/объекты материального мира). 
Пользователю необходимо предположить год, в котором произошло событие, описанное на карточке, и разместить её в хронологическом порядке на временной линии.

Использовано: 
HTML
CSS + SASS
JavaScript
React
Next.js
MongoDB
Redux + Redux Toolkit
REST API MediaWiki

Реализованные осовные особенности:
1) Есть 4 режима игры - 1 на каждую категорию и режим, где могут попасться карточки любой категории.

2) Есть небольшое обучение, которое показывается при нажатии на кнопку "Как играть?".

3) База данных карточек сделана с помощью REST API MediaWiki, хранится в MongoDB и насчитывает 509 экземпляров.

4) Перетаскивание карточки включает себя подсветку на месте, где можно её разместить, отодвигание других карточек при необходимости, перемещение временной линии при нехватке места на экране.

5) Изображения НЕ хранятся локально. При генерации карточки выполняется запрос с необходимыми ограничениями(категория,отсев уже сыгранных карточей) в MongoDB. 
Далее на основе названия карточки выполняется запрос на изображение в MediaWiki. 

6) Используются куки-файлы при помощи пакета 'react-cookie'. В них хранятся лучший результат пользователя и карточки, которые уже были сыграны. 
Пока пользователь не сыграет все карточки определенное категории(~170 в каждой), повторов не будет.

7) После размещения на карточку можно кликнуть и перейти на соответствующую страницу Википедии.

8) У пользователя есть 3 права на ошибку (жизни отображены в левой верхней части), после чего игра заканчивается.

9) Весь массив сыгранных карточек, логика по добавлении новых карточей и определению правильности их размещения сделана при помощи Redux Toolkit.


Все исторические даты представлены на основе данных из английской версии Википедии. Некоторые даты(особенно в древности) могут быть приблизительными, я старался сводить количество таких дат к минимуму. 
Если у 2 карточек одинаковый год события, то размещайте относительно месяца. Если месяцы одинаковые или не указаны в базе данных, то размещение такой карточки будет считаться правильным вне зависимости от того, по какую сторону от второй карточки вы её разместите.

Приложения НЕ адаптировано под любые другие разрешения, кроме 1920x1080. 

Из-за особенностей MediaWiki некоторые картинки могут быть немного обрезаны и только частично содержать изображение соответствующее объекту карточки. 




















This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
