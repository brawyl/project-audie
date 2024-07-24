import UploadForm from './ui/upload-form';
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-6 hero">
      <div>
        <img className='bg'></img>
      </div>
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <div className="centered">
          <h2>Podcast audio processing for BIPOC Healing and Wellness Center</h2>
        </div>
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
          <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
            <UploadForm />
          </div>
        </div>
        <div className="centered">
          <h2>Your cleaned up audio file along with the text transcript will be sent to your email address once processing is complete.</h2>
        </div>
        <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
        </div>
      </div>
    </main>
  );
}
