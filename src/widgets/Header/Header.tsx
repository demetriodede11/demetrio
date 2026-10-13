import Link from 'next/link';

import Logo from '$public/logo/logo-dark.svg';
import { PATHS } from '$shared/routes';

export const Header = () => (
  <header id="header">
    <Link href={PATHS.home.path}>
      <Logo />
    </Link>
    <Link href={PATHS.about.path}>О компании</Link>
    <Link href={PATHS.documents.path}>Документы</Link>
    <Link href={PATHS.questions.path}>Вопросы</Link>
  </header>
);
