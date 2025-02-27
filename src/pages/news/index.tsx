import axios from 'axios';
import { useTranslation } from 'next-i18next';
import NewsItem from '../../components/News/NewsItem';
import Config from '../../Config';
import { NewsletterData } from '../../types.client.mongo';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import ConfigService from '../../services/ConfigService';
import { Meta } from '../../layout/Meta';
import Base from '../../templates/Base';
import { GetServerSidePropsContext } from 'next';
import AdvertisementDisplay from '../../components/Advertisement/AdvertisementDisplay';
import AdvertisementUnit from '../../components/Advertisement/Units/AdvertisementUnit';

interface IProps {
  newsData: NewsletterData[];
}

const News = ({ newsData }: IProps) => {
  const { t } = useTranslation();
  const getLatestNewsId =
    typeof localStorage !== 'undefined' ? parseInt(localStorage.getItem('latestNewsId') || '', 10) || 0 : 0;

  return (
    <Base meta={<Meta title={t('page.queue.titles.latestNews')} />} ads={{ enableBottomRail: true }} contentTopBorder>
      <div className="container container-padding container-content">
        <div className="grid grid-cols-3 gap-8 mb-4 py-16">
          <div className="col-span-full lg:col-span-2 lg:pr-32 my-auto">
            <h1 className="h1-jumbo">{t('page.queue.titles.latestNews')}</h1>
            <p className="pt-6 text-lg">
              Check out our latest news and updates regarding Keymash and learn about any upcoming tournaments and
              events!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {newsData.map((row) => (
            <NewsItem isBig key={row.slug} {...row} showUnread={row.increment > getLatestNewsId} />
          ))}
        </div>

        <AdvertisementDisplay className="mt-4">
          <AdvertisementUnit type={'leaderboard-bottom'} />
        </AdvertisementDisplay>
      </div>
    </Base>
  );
};

export async function getServerSideProps({ req }: GetServerSidePropsContext) {
  const getNews = async () => {
    const response = await axios.get(`${Config.apiUrl}/newsletter/list?limit=50`).catch((e) => console.log(e));
    if (response && response.data) return response.data.data;
    else return [];
  };

  return {
    props: {
      ...(await serverSideTranslations(ConfigService.getServerSideOption('locale', req.headers.cookie || ''))),
      newsData: await getNews(),
    },
  };
}

export default News;
