import { Link } from "react-router-dom";

export default function About(){

    return(
        <>

            <h3>Company lore</h3>

            <br />

            <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Nullam lectus justo, vulputate eget mollis sed, tempor sed magna. Aliquam erat volutpat. Nullam lectus justo, vulputate eget mollis sed, tempor sed magna. Vivamus luctus egestas leo. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos hymenaeos. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. In rutrum. Mauris elementum mauris vitae tortor. Nam sed tellus id magna elementum tincidunt.</p>

            <h3>Informations about company</h3>

            <br />

            <p>Company name: Joynda s.r.o.</p>
            <br />

            <p>Residence: Spálená 480/1, Trnitá, 602 00 Brno</p>
            <br />

            <p>IČO: 21164517</p>
            <br />

            <p>email: example@gmail.com</p>
            <br />

            <p>DIČ: ???? teprve dostaneme nejspis</p>
            <br />
            
            <br />

            <h3>Terms of service</h3>

            <Link to={"term-or-servise"}>Terms of service</Link>

            <br />

            <h3>GDPR</h3>

            <p>Podpurujeme GDRP atd.</p>

            <br />

            <h3>Terms of refunds</h3>

            <Link to={"term-or-refund"}>Terms of refunds</Link>
        </>
    )
}