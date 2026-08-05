type DisplayStageProps = {
  text: string;
};

export function DisplayStage({ text }: DisplayStageProps) {
  const preview = text.trim().length > 0 ? text : 'NHAP NOI DUNG';

  return (
    <section className="display-stage" data-testid="display-stage" aria-label="Màn hình Matrix LED">
      <div className="display-stage__bezel">
        <p className="display-stage__placeholder">{preview}</p>
      </div>
    </section>
  );
}
