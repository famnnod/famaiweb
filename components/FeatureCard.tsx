// type FeatureCardProps = {
//     title: string;
//     description: string;
// };
// export function FeatureCard({
//     title,
//     description
// }: FeatureCardProps) {
//     return (
//         <section>
//             <h2>{title}</h2>
//             <p>{description}</p>
//         </section>
//     );
// }

type FeatureCardProps = {
    title: string;
    description: string;
};
export function FeatureCard({
    title,
    description,
}: FeatureCardProps) {
    return (
        <section className="ux-card ux-feature">
            <h2>{title}</h2>
            <p className="ux-muted">
                {description}
            </p>
        </section>
    );
}
