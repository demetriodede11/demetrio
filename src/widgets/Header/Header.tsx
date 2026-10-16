import Link from 'next/link';

import { PATHS } from '$shared/routes';

export const Header = () => (
  <header id="header">
    <Link href={PATHS.home.path}>Главная</Link>
    <Link href={PATHS.about.path}>О компании</Link>
    <Link href={PATHS.documents.path}>Документы</Link>
    <Link href={PATHS.questions.path}>Вопросы</Link>
  </header>
);
